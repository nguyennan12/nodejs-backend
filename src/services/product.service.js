import ApiError from '#core/error.response.js'
import { productModel, electronicModel, clothingModel, furnitureModel } from '#models/product.model.js'
import { StatusCodes } from 'http-status-codes'
import productRepo from '#models/repository/product.repo.js'


class ProductFatory {

  static productRegistry = {}

  static registerProductType(type, classRef) {
    ProductFatory.productRegistry[type] = classRef //key<type> : value<classRef>
  }

  //===== CREATE =====
  static async createProduct(type, payload) {
    const productClass = ProductFatory.productRegistry[type]
    if (!productClass) throw new ApiError(StatusCodes.BAD_REQUEST, 'Invalid Product Types ', type)

    return new productClass(payload).createProduct()
  }

  //===== UPDATE =====
  static async publishProductByShop({ product_shop, product_id }) {
    return await productRepo.publishProductByShop({ product_shop, product_id })
  }
  static async unPublishProductByShop({ product_shop, product_id }) {
    return await productRepo.unPublishProductByShop({ product_shop, product_id })
  }
  static async updateProduct() {

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

  static async findAllProducts({ limit = 50, sort = 'ctime', page = 1, filter = { isPublished: true } }) {
    return await productRepo.findAllProducts({
      limit, sort, filter, page,
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
    return await productModel.create({ ...this, _id: product_id })
  }
}

class Clothing extends Product {
  async createProduct() {
    const newClothing = await clothingModel.create(this.product_attributes)
    if (!newClothing) throw new ApiError(StatusCodes.BAD_REQUEST, 'create new Clothing error')

    const newProduct = await super.createProduct()
    if (!newProduct) throw new ApiError(StatusCodes.BAD_REQUEST, 'create new Product error')

    return newProduct
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
}

//register product types
ProductFatory.registerProductType('Electronics', Electronics)
ProductFatory.registerProductType('Clothing', Clothing)
ProductFatory.registerProductType('Furniture', Furniture)

export default ProductFatory