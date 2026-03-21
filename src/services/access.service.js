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

    if (newShop) {
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
      console.log('token: ', tokens)
      return {
        code: StatusCodes.CREATED,
        metadata: {
          shop: getInfoData({ fields: ['_id', 'name', 'email'], object: newShop }),
          tokens
        }
      }
    }
    return {
      code: StatusCodes.OK,
      metadata: null
    }
  }
}

export default AccessService