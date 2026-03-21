/* eslint-disable no-unused-vars */
import shopModel from '#models/shop.model.js'
import bcrypt from 'bcrypt'
import crypto from 'crypto'
import KeyTokenService from './keyToken.service.js'
import { createTokenPair } from '#auth/authUntils.js'
import { StatusCodes } from 'http-status-codes'
import { getInfoData } from '#utils/index.js'
import ApiError from '#core/error.response.js'
import { shopService } from './shop.service.js'

const ROLE_SHOP = {
  SHOP: 'SHOP',
  WRITE: 'WRITE',
  EDITOR: 'EDITOR',
  ADMIN: 'ADMIN'
}

class AccessService {

  // ====== SignUp ======
  static signUp = async ({ name, email, password }) => {
    const shopExists = await shopService.findByEmail({ email })
    if (shopExists) throw new ApiError(StatusCodes.CONFLICT, 'Shop already registered!')

    const passwordHash = await bcrypt.hash(password, 10)
    const newShop = await shopModel.create({
      name, email, password: passwordHash, roles: [ROLE_SHOP.SHOP]
    })

    if (!newShop) throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Register shop failed!')

    const publicKey = crypto.randomBytes(64).toString('hex')
    const privateKey = crypto.randomBytes(64).toString('hex')

    const keyStore = await KeyTokenService.createKeyToken({
      userId: newShop._id,
      publicKey,
      privateKey
    })

    if (!keyStore) throw new ApiError(StatusCodes.UNAUTHORIZED, 'keyStore error')

    const tokens = await createTokenPair({ userId: newShop._id, email }, publicKey, privateKey)

    return {
      shop: getInfoData({ fields: ['_id', 'name', 'email'], object: newShop }),
      tokens
    }
  }

  // =====Login ======
  static login = async ({ email, password, refreshToken = null }) => {
    const shopExists = await shopService.findByEmail({ email })
    if (!shopExists) throw new ApiError(StatusCodes.BAD_REQUEST, 'Shop not registered!')

    const matchPassword = await bcrypt.compare(password, shopExists.password)
    if (!matchPassword) throw new ApiError(StatusCodes.UNAUTHORIZED, 'Authentication error')

    const publicKey = crypto.randomBytes(64).toString('hex')
    const privateKey = crypto.randomBytes(64).toString('hex')
    const { _id: userId } = shopExists
    const tokens = await createTokenPair({ userId, email }, publicKey, privateKey)

    await KeyTokenService.createKeyToken({
      refreshToken: tokens.refreshToken,
      privateKey, publicKey, userId
    })

    return {
      shop: getInfoData({ fields: ['_id', 'name', 'email'], object: shopExists }),
      tokens
    }
  }
}

export default AccessService