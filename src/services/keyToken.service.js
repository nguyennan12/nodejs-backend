import keyTokenModel from '#models/keyToken.model.js'
import { Types } from 'mongoose'
class KeyTokenService {
  static createKeyToken = async ({ userId, publicKey, privateKey, refreshToken }) => {
    try {
      const filter = { userId: userId }
      const update = { publicKey, privateKey, refreshTokenUsed: [], refreshToken }
      const options = { upsert: true, new: true }

      const tokens = await keyTokenModel.findOneAndUpdate(filter, update, options)
      return tokens ? tokens.publicKey : null
    } catch (error) {
      throw error
    }
  }

  static findByUserId = async (userId) => {
    return await keyTokenModel.findOne({ userId: new Types.ObjectId(userId) }).lean()
  }

  static removeKeyById = async (id) => {
    return await keyTokenModel.deleteOne({ _id: id })
  }
}

export default KeyTokenService