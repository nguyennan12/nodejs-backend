import ApiError from '#core/error.response.js'
import { productModel, electronicModel, clothingModel, furnitureModel } from '#models/product.model.js'
import { StatusCodes } from 'http-status-codes'
import productRepo from '#models/repository/product.repo.js'
import { updateNestedObjectParser, removeUndefinedObject } from '#utils/index.js'
import inventoryRepo from '#models/repository/inventory.repo.js'
import notiificationService from './notiification.service.js'
import converter from '#utils/converter.js'


class ProductFatory {

  static productRegistry = {}

  static registerProductType(type, classRef) {
    ProductFatory.productRegistry[type] = classRef //key<type> : value<classRef>
  }

  //===== CREATE =====
  static async createProduct(type, payload) {
    const productClass = ProductFatory.productRegistry[type]
    if (!productClass) throw new ApiError(StatusCodes.BAD_REQUEST, 'Invalid Product Types ', type)
    notiificationService.pushNotiToSytem({
      type: 'SHOP-001',
      receivedId: 3,
      senderId: converter.toObjectId(payload.product_shop),
      option: {
        product_name: payload.product_name,
        shop_name: payload.product_shop
      }
    }).then(rs => console.log(rs)).catch(console.error)
    return new productClass(payload).createProduct()
  }

  static async updateProduct(type, productId, payload) {
    const productClass = ProductFatory.productRegistry[type]
    if (!productClass) throw new ApiError(StatusCodes.BAD_REQUEST, 'Invalid Product Types ', type)

    return new productClass(payload).updateProduct(productId)
  }

  //===== UPDATE =====
  static async publishProductByShop({ product_shop, product_id }) {
    return await productRepo.publishProductByShop({ product_shop, product_id })
  }
  static async unPublishProductByShop({ product_shop, product_id }) {
    return await productRepo.unPublishProductByShop({ product_shop, product_id })
  }

  //===== QUERY =====
  static async findAllDraftsForShop({ product_shop, limit = 50, skip = 0 }) {
    const query = { product_shop, isDraft: true }
    return await productRepo.queryProduct({ query, limit, skip })
  }

  static async findAllPublishForShop({ product_shop, limit = 50, skip = 0 }) {
    const query = { product_shop, isPublished: true }
    return await productRepo.queryProduct({ query, limit, skip })
  }

  static async searchProducts({ keySearch }) {
    return await productRepo.searchProducts({ keySearch })
  }

  static async findAllProducts({ limit = 50, page = 1 }) {
    const skip = (page - 1) * limit
    return await productRepo.findAllProducts({
      limit: +limit,
      skip: +skip,
      filter: { isPublished: true },
      select: ['product_name', 'product_price', 'product_thumb']
    })
  }

  static async findProduct({ product_id }) {
    return productRepo.findProduct({ product_id, unSelect: ['__v', 'product_variations'] })
  }
}

class Product {
  constructor({
    product_name, product_thumb, product_description, product_price,
    product_quantity, product_type, product_attributes, product_shop }) {
    this.product_name = product_name
    this.product_thumb = product_thumb
    this.product_description = product_description
    this.product_price = product_price
    this.product_quantity = product_quantity
    this.product_type = product_type
    this.product_attributes = product_attributes
    this.product_shop = product_shop
  }

  async createProduct(product_id) {
    const newProduct = await productModel.create({ ...this, _id: product_id })
    if (newProduct) {
      await inventoryRepo.insertInventory({
        productId: newProduct.id,
        shopId: newProduct.product_shop,
        stock: newProduct.product_quantity
      })
    }
    return newProduct
  }

  async updateProduct(productId, payload) {

    return await productRepo.updateProductById({ productId, payload, model: productModel })
  }
}

class Clothing extends Product {
  async createProduct() {
    const newClothing = await clothingModel.create({
      ...this.product_attributes,
      product_shop: this.product_shop
    })
    if (!newClothing) throw new ApiError(StatusCodes.BAD_REQUEST, 'create new Clothing error')

    const newProduct = await super.createProduct(newClothing._id)
    if (!newProduct) throw new ApiError(StatusCodes.BAD_REQUEST, 'create new Product error')

    return newProduct
  }

  async updateProduct(productId) {
    const objectParams = updateNestedObjectParser(this)
    if (objectParams.product_attributes) {
      //update child
      await productRepo.updateProductById({ productId, payload: objectParams, model: clothingModel })
    }
    const updatedProduct = await super.updateProduct(productId)
    return updatedProduct
  }

}

class Electronics extends Product {
  async createProduct() {
    const newElectronic = await electronicModel.create({
      ...this.product_attributes,
      product_shop: this.product_shop
    })
    if (!newElectronic) throw new ApiError(StatusCodes.BAD_REQUEST, 'create new Electronic error')

    const newProduct = await super.createProduct(newElectronic._id)
    if (!newProduct) throw new ApiError(StatusCodes.BAD_REQUEST, 'create new Product error')

    return newProduct
  }

  async updateProduct(productId) {
    const objectParams = removeUndefinedObject(this)
    if (objectParams.product_attributes) {
      //update child
      await productRepo.updateProductById({ productId, payload: updateNestedObjectParser(objectParams), model: electronicModel })
    }
    const updatedProduct = await super.updateProduct(productId)
    return updatedProduct
  }
}

class Furniture extends Product {
  async createProduct() {
    const newFurnituries = await furnitureModel.create({
      ...this.product_attributes,
      product_shop: this.product_shop
    })
    if (!newFurnituries) throw new ApiError(StatusCodes.BAD_REQUEST, 'create new Furniture error')

    const newProduct = await super.createProduct(newFurnituries._id)
    if (!newProduct) throw new ApiError(StatusCodes.BAD_REQUEST, 'create new Furniture error')

    return newProduct
  }

  async updateProduct(productId) {
    const objectParams = removeUndefinedObject(this)
    if (objectParams.product_attributes) {
      //update child
      await productRepo.updateProductById({ productId, payload: updateNestedObjectParser(objectParams.product_attributes), model: furnitureModel })
    }
    const updatePayload = updateNestedObjectParser(objectParams)
    const updatedProduct = await super.updateProduct(productId, updatePayload)
    return updatedProduct
  }
}

//register product types
ProductFatory.registerProductType('Electronics', Electronics)
ProductFatory.registerProductType('Clothing', Clothing)
ProductFatory.registerProductType('Furniture', Furniture)

export default ProductFatory