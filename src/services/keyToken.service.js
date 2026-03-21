import keyTokenModel from '#models/keyToken.model.js'

class KeyTokenService {
  static createKeyToken = async ({ userId, publicKey, privateKey }) => {
    try {
      const tokens = await keyTokenModel.create({
        userId: userId,
        publicKey,
        privateKey
      })
      return tokens ? tokens.publicKey : null
    } catch (error) {
      throw error
    }
  }
}

export default KeyTokenService