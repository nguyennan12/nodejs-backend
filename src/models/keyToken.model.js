import mongoose from 'mongoose'

const { Schema } = mongoose

const DOCUMENT_NAME = 'Key'
const COLLECTION_NAME = 'Keys'
// Declare the Schema of the Mongo model
const keyTokenSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Shop'
  },
  publicKey: {
    type: String,
    required: true
  },
  privateKey: {
    type: String,
    required: true
  },
  refreshToken: {
    type: Array,
    default: []
  },

}, {
  timestamps: true,
  collection: COLLECTION_NAME
})

export default mongoose.model(DOCUMENT_NAME, keyTokenSchema)

