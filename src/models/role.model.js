import mongoose from 'mongoose'

import { Schema } from 'mongoose'

const DOCUMENT_NAME = 'role'
const COLLECTION_NAME = 'roles'

const roleSchema = new Schema({
  role_name: { type: String, default: 'user', enum: ['user', 'shop', 'admin'] },
  role_slug: { type: String, required: true },
  role_status: { type: String, default: 'active', enum: ['pending', 'active', 'block'] },
  role_description: { type: String, default: '' },
  role_grants: [
    {
      resource: { type: Schema.Types.ObjectId, ref: 'Resource', required: true },
      actions: [{ type: String, required: true }],
      attributes: { type: String, default: '*' }
    }
  ]
}, {
  timestamps: true,
  collection: COLLECTION_NAME
})

export default mongoose.model(DOCUMENT_NAME, roleSchema)