import keyTokenModel from '#models/keyToken.model.js'
import { Types } from 'mongoose'
class KeyTokenService {
  static createKeyToken = async ({ userId, publicKey, privateKey, refreshToken }) => {
    try {
      const filter = { userId: userId }
      const update = { publicKey, privateKey, refreshTokenUsed: [], refreshToken }
      const options = { upsert: true, new: true, setDefaultsOnInsert: true }

      const tokens = await keyTokenModel.findOneAndUpdate(filter, update, options)
      return tokens || null
    } catch (error) {
      throw error
    }
  }

  static findByUserId = async (userId) => {
    return await keyTokenModel.findOne({ userId: new Types.ObjectId(userId) })
  }

  static removeKeyById = async (id) => {
    return await keyTokenModel.deleteOne({ _id: id })
  }

  static findByRefreshTokenUsed = async (refreshToken) => {
    return await keyTokenModel.findOne({ refreshTokenUsed: refreshToken }).lean()
  }

  static findByRefreshToken = async (refreshToken) => {
    return await keyTokenModel.findOne({ refreshToken })
  }

  static deleteKeyById = async (userId) => {
    return await keyTokenModel.deleteOne({ userId: new Types.ObjectId(userId) })
  }
}

export default KeyTokenService