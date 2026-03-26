import { Types } from 'mongoose'

const toObjectId = id => Types.ObjectId(id)

export default {
  toObjectId
}