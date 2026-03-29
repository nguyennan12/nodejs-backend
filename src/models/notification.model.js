
import mongoose from 'mongoose'

import { Schema, Types } from 'mongoose'

const DOCUMENT_NAME = 'Notification'
const COLLECTION_NAME = 'Notifications'

//order-001: order success
//order-002: order fail
//promotion-001: new voucher
//shop-001: new product by user follow

const notificationSchema = new Schema({
  noti_type: { type: String, enum: ['ORDER-001', 'ORDER-002', 'PROMOTION-001', 'SHOP-001'], required: true },
  noti_senderId: { type: Types.ObjectId, required: true, ref: 'Shop' },
  noti_receivedId: { type: Number, required: true },
  noti_content: { type: String, required: true },
  noti_options: { type: Object, default: {} }
}, {
  timestamps: { createAt: 'createdOn', updateAt: 'modifiedOn' },
  collection: COLLECTION_NAME
})

export default mongoose.model(DOCUMENT_NAME, notificationSchema)