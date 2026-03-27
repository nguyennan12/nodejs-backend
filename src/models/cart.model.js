
import mongoose from 'mongoose'

import { Schema } from 'mongoose'

const DOCUMENT_NAME = 'Cart'
const COLLECTION_NAME = 'Carts'

const cartSchema = new Schema({
  cart_state: {
    type: String, required: true,
    enum: ['active', 'completed', 'failed', 'pending'],
    default: 'active'
  },
  cart_products: { type: Array, default: [] },//in cart have productId, shopId, quantity, name, price
  cart_count_product: { type: Number, default: 0 },
  cart_userId: { type: Number, required: true }

}, {
  timestamps: { createAt: 'createdOn', updateAt: 'modifiedOn' },
  collection: COLLECTION_NAME
})

export default mongoose.model(DOCUMENT_NAME, cartSchema)