import keyTokenModel from '#models/keyToken.model.js'

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
}

export default KeyTokenService