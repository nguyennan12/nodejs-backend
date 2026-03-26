import mongoose from 'mongoose'

import { Schema } from 'mongoose'

const DOCUMENT_NAME = 'Discount'
const COLLECTION_NAME = 'Discounts'

const discountSchema = new Schema({
  discount_name: { type: String, required: true },
  discount_description: { type: String, required: true },
  discount_type: { type: String, default: 'fixed_amount' },
  discount_value: { type: Number, required: true }, //10.000vnd or 10%
  discount_code: { type: String, required: true },
  discount_start_date: { type: Date, required: true },
  discount_end_date: { type: Date, required: true },
  discount_max_uses: { type: Number, required: true },
  discount_user_count: { type: Number, required: true }, //số discount  user đã sử dụng
  discount_user_used: { type: Array, default: [] }, // user nào đã sử dụng discount
  discount_max_uses_per_user: { type: Number, required: true }, // số discount tối đa dc sử dụng cho mỗi user
  discount_min_order_value: { type: Number, required: true }, //giá trị tối thiểu để sử dụng discount
  discount_shopId: { type: Schema.Types.ObjectId, ref: 'Shop' },
  discount_is_active: { type: Boolean, default: true },
  discount_applies_to: { type: String, required: true, enum: ['all', 'specific'] },
  discount_product_ids: { type: Array, default: [] } //số sản phẩm dc áp dụng
}, {
  timestamps: true,
  collection: COLLECTION_NAME
})

export default mongoose.model(DOCUMENT_NAME, discountSchema)