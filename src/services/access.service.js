import shopModel from '#models/shop.model.js'
import bcrypt from 'bcrypt'
import crypto from 'crypto'
import KeyTokenService from './keyToken.service.js'
import { createTokenPair } from '#auth/authUntils.js'
import { StatusCodes } from 'http-status-codes'
import { getInfoData } from '#utils/index.js'

const ROLE_SHOP = {
  SHOP: 'SHOP',
  WRITE: 'WRITE',
  EDITOR: 'EDITOR',
  ADMIN: 'ADMIN'
}

class AccessService {
  static signUp = async ({ name, email, password }) => {
    try {
      const holderShop = await shopModel.findOne({ email }).lean()
      if (holderShop) {
        return {
          code: 'xxx',
          message: 'shop already registered'
        }
      }
      const passwordHash = await bcrypt.hash(password, 10)
      const newShop = await shopModel.create({
        name, email, password: passwordHash, roles: [ROLE_SHOP.SHOP]
      })

      if (newShop) {
        //created privateKey, publicKey
        // const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
        //   modulusLength: 4096,
        //   publicKeyEncoding: {
        //     type: 'pkcs1',
        //     format: 'pem'
        //   },
        //   privateKeyEncoding: {
        //     type: 'pkcs1',
        //     format: 'pem'
        //   }
        // })
        const publicKey = crypto.randomBytes(64).toString('hex')
        const privateKey = crypto.randomBytes(64).toString('hex')
        console.log({ privateKey, publicKey })
        //lay public key la String r luu vao db
        const keyStore = await KeyTokenService.createKeyToken({
          userId: newShop._id,
          publicKey,
          privateKey
        })

        if (!keyStore) {
          return {
            code: 'xxxx',
            message: 'keyStore error'
          }
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

    } catch (error) {
      return error
    }
  }
}

export default AccessService