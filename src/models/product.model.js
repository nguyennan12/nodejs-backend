import { model, Schema } from 'mongoose'
import slugify from 'slugify'

const DOCUMENT_NAME = {
  PRODUCT: 'Product',
  ELECTRONIC: 'Electronic',
  CLOTHING: 'Clothing',
  FURNITURE: 'Furniture'
}
const COLLECTION_NAME = {
  PRODUCT: 'Products',
  ELECTRONIC: 'Electronics',
  CLOTHING: 'Clothes',
  FURNITURE: 'Furniture'
}

const productSchema = new Schema({
  product_name: { type: String, required: true },
  product_thumb: { type: String, required: true },
  product_description: String,
  product_slug: String,
  product_price: { type: Number, required: true },
  product_quantity: { type: Number, required: true },
  product_type: { type: String, required: true, enum: ['Electronics', 'Clothing', 'Furniture'] },
  product_shop: { type: Schema.Types.ObjectId, ref: 'Shop' },
  product_attributes: { type: Schema.Types.Mixed, required: true },
  //special data
  product_ratingsAverange: {
    type: Number,
    default: 4.5,
    min: [1, 'Rating must be above 1.0'],
    max: [5, 'Rating must be above 5.0'],
    //func in mongoose
    set: (val) => Math.round(val * 10) / 10
  },
  product_variations: { type: Array, default: [] },
  isDraft: { type: Boolean, default: true, index: true, select: false },
  isPublished: { type: Boolean, default: false, index: true, select: false },
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

const furnitureSchema = new Schema({
  brand: { type: String, required: true },
  size: String,
  material: String
}, {
  collection: COLLECTION_NAME.FURNITURE,
  timestamps: true
})

//create index for search
productSchema.index({ product_name: 'text', product_description: 'text' })
//document middleware (before save and create)
productSchema.pre('save', async function () {
  this.product_slug = slugify(this.product_name, { lower: true })
})


export const productModel = model(DOCUMENT_NAME.PRODUCT, productSchema)
export const clothingModel = model(DOCUMENT_NAME.CLOTHING, clothingSchema)
export const electronicModel = model(DOCUMENT_NAME.ELECTRONIC, electronicSchema)
export const furnitureModel = model(DOCUMENT_NAME.FURNITURE, furnitureSchema)