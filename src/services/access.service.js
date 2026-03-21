/* eslint-disable no-unused-vars */
import shopModel from '#models/shop.model.js'
import bcrypt from 'bcrypt'
import crypto, { verify } from 'crypto'
import KeyTokenService from './keyToken.service.js'
import { createTokenPair, verifyJWT } from '#auth/authUntils.js'
import { StatusCodes } from 'http-status-codes'
import { getInfoData } from '#utils/index.js'
import ApiError from '#core/error.response.js'
import { shopService } from './shop.service.js'
import keyTokenModel from '#models/keyToken.model.js'
import { ref } from 'process'

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

    const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
      modulusLength: 4096,
      publicKeyEncoding: { type: 'pkcs1', format: 'pem' },
      privateKeyEncoding: { type: 'pkcs1', format: 'pem' }
    })

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

  // ===== Login ======
  static login = async ({ email, password, refreshToken = null }) => {
    const shopExists = await shopService.findByEmail({ email })
    if (!shopExists) throw new ApiError(StatusCodes.BAD_REQUEST, 'Shop not registered!')

    const matchPassword = await bcrypt.compare(password, shopExists.password)
    if (!matchPassword) throw new ApiError(StatusCodes.UNAUTHORIZED, 'Authentication error')

    const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
      modulusLength: 4096,
      publicKeyEncoding: { type: 'pkcs1', format: 'pem' },
      privateKeyEncoding: { type: 'pkcs1', format: 'pem' }
    })
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


  // ===== LogOut ======
  static logout = async (keyStore) => {
    if (!keyStore?._id) throw new ApiError(StatusCodes.UNAUTHORIZED, 'Invalid keyStore')
    return await KeyTokenService.removeKeyById(keyStore._id)
  }

  // ===== refreshToken ======
  static handlerRefreshToken = async (refreshToken) => {
    const tokenUsed = await KeyTokenService.findByRefreshTokenUsed(refreshToken)

    //token da duoc su dunng r
    if (tokenUsed) {
      const { userId, email } = verifyJWT(refreshToken, tokenUsed.publicKey)
      await KeyTokenService.deleteKeyById(userId)
      throw new ApiError(StatusCodes.FORBIDDEN, 'Something wrong happen! please relogin')
    }

    //token dang dc su dung
    const tokenExists = await KeyTokenService.findByRefreshToken(refreshToken)
    if (!tokenExists) throw new ApiError(StatusCodes.UNAUTHORIZED, 'shop not registeted')
    const { userId, email } = verifyJWT(refreshToken, tokenExists.publicKey)

    const shopExists = await shopService.findByEmail({ email })
    if (!shopExists) throw new ApiError(StatusCodes.UNAUTHORIZED, 'shop not registeted')

    //tao cap token moi
    const tokens = await createTokenPair({ userId, email }, tokenExists.publicKey, tokenExists.privateKey)

    //update laji token
    await tokenExists.updateOne({
      $set: {
        refreshToken: tokens.refreshToken
      },
      $addToSet: {
        refreshTokenUsed: refreshToken
      }
    })

    return {
      user: { userId, email },
      tokens
    }
  }
}

export default AccessService