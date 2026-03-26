import mongoose from 'mongoose'

import { Schema } from 'mongoose'

const DOCUMENT_NAME = 'Inventory'
const COLLECTION_NAME = 'Inventories'

const inventorySchema = new Schema({
  iven_productId: { type: Schema.Types.ObjectId, ref: 'Product' },
  iven_location: { type: String, default: 'unkown' },
  iven_stock: { type: Number, required: true },
  iven_shopId: { type: Schema.Types.ObjectId, ref: 'Shop' },
  iven_reservations: { type: Array, default: [] } //cardId, stock, createOn, đơn hàng tạm tính
}, {
  timestamps: true,
  collection: COLLECTION_NAME
})

export default mongoose.model(DOCUMENT_NAME, inventorySchema)