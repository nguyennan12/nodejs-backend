import { model, Schema } from 'mongoose'

const DOCUMENT_NAME = {
  PRODUCT: 'Product',
  ELECTRONIC: 'Electronic',
  CLOTHING: 'Clothing'
}
const COLLECTION_NAME = {
  PRODUCT: 'Products',
  ELECTRONIC: 'Electronics',
  CLOTHING: 'Clothes'
}

const productSchema = new Schema({
  product_name: { type: String, required: true },
  product_thumb: { type: String, required: true },
  product_description: String,
  product_price: { type: Number, required: true },
  product_quantity: { type: Number, required: true },
  product_type: { type: String, required: true, enum: ['Electronics', 'Clothing', 'Furniture'] },
  product_shop: { type: Schema.Types.ObjectId, ref: 'Shop' },
  product_attributes: { type: Schema.Types.Mixed, required: true }
}, {
  collection: COLLECTION_NAME.PRODUCT,
  timestamps: true
})

const clothingSchema = new Schema({
  brand: { type: String, required: true },
  size: String,
  material: String
}, {
  collection: COLLECTION_NAME.CLOTHING,
  timestamps: true
})


const electronicSchema = new Schema({
  manufacturer: { type: String, required: true },
  model: String,
  color: String
}, {
  collection: COLLECTION_NAME.ELECTRONIC,
  timestamps: true
})

export const productModel = model(DOCUMENT_NAME.PRODUCT, productSchema)
export const clothingModel = model(DOCUMENT_NAME.CLOTHING, clothingSchema)
export const electronicModel = model(DOCUMENT_NAME.ELECTRONIC, electronicSchema)