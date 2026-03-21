import shopModel from '#models/shop.model.js'
import bcrypt from 'bcrypt'
import crypto from 'crypto'
import KeyTokenService from './keyToken.service.js'
import { createTokenPair } from '#auth/authUntils.js'
import { StatusCodes } from 'http-status-codes'
import { getInfoData } from '#utils/index.js'
import ApiError from '#core/error.response.js'

const ROLE_SHOP = {
  SHOP: 'SHOP',
  WRITE: 'WRITE',
  EDITOR: 'EDITOR',
  ADMIN: 'ADMIN'
}

class AccessService {
  static signUp = async ({ name, email, password }) => {

    const holderShop = await shopModel.findOne({ email }).lean()
    if (holderShop) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Shop already registered!')
    }
    const passwordHash = await bcrypt.hash(password, 10)

    const newShop = await shopModel.create({
      name, email, password: passwordHash, roles: [ROLE_SHOP.SHOP]
    })
    //neu khong tao dc shop
    if (!newShop) {
      throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Register shop failed!')
    }
    const publicKey = crypto.randomBytes(64).toString('hex')
    const privateKey = crypto.randomBytes(64).toString('hex')

    const keyStore = await KeyTokenService.createKeyToken({
      userId: newShop._id,
      publicKey,
      privateKey
    })

    if (!keyStore) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, 'keyStore error')
    }

    //create token pair
    const tokens = await createTokenPair({ userId: newShop._id, email }, publicKey, privateKey)

    return {
      shop: getInfoData({ fields: ['_id', 'name', 'email'], object: newShop }),
      tokens
    }
  }
}

export default AccessService