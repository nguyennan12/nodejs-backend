/* eslint-disable indent */
import ApiError from '#core/error.response.js'
import { productModel, electronicModel, clothingModel } from '#models/product.model.js'
import { StatusCodes } from 'http-status-codes'

class ProductFatory {
  static async createProduct(type, payload) {
    switch (type) {
      case 'Electronics':
        return new Electronics(payload).createProduct()
      case 'Clothing':
        return new Clothing(payload).createProduct()
      default:
        throw new ApiError(StatusCodes.BAD_REQUEST, 'Invalid Product Types ', type)
    }
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

export default ProductFatory