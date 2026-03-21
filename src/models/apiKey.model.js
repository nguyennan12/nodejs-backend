import mongoose from 'mongoose'

import { Schema } from 'mongoose'

const DOCUMENT_NAME = 'ApiKey'
const COLLECTION_NAME = 'ApiKeys'

const ApiKeySchema = new Schema({
  key: {
    type: String,
    required: true,
    unique: true
  },
  status: {
    type: Boolean,
    default: true
  },
  permissions: {
    type: [String],
    required: true,
    enum: ['0000', '1111', '2222']
  }
}, {
  timestamps: true,
  collection: COLLECTION_NAME
})

export default mongoose.model(DOCUMENT_NAME, ApiKeySchema)