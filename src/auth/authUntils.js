import ApiError from '#core/error.response.js'
import asyncHandler from '#helpers/asyncHandler.js'
import KeyTokenService from '#services/keyToken.service.js'
import { StatusCodes } from 'http-status-codes'
import JWT from 'jsonwebtoken'
const HEADER = {
  API_KEY: 'x-api-key',
  CLIENT_ID: 'x-client-id',
  AUTHORIZATION: 'authorization'
}

const createTokenPair = async (payload, publicKey, privateKey) => {
  try {


    const accessToken = JWT.sign(payload, privateKey, {
      // algorithm: 'RS256',
      expiresIn: '2 days'
    })

    const refreshToken = JWT.sign(payload, publicKey, {
      // algorithm: 'RS256',
      expiresIn: '7 days'
    })
    return { accessToken, refreshToken }
  } catch (error) {
    throw error
  }
}

const authentication = asyncHandler(async (req, res, next) => {
  const userId = req.headers[HEADER.CLIENT_ID]
  if (!userId) throw new ApiError(StatusCodes.UNAUTHORIZED, 'Invalid Request')

  const accessToken = req.headers[HEADER.AUTHORIZATION]
  if (!accessToken) throw new ApiError(StatusCodes.UNAUTHORIZED, 'Invalid Request')

  const keyStore = await KeyTokenService.findByUserId(userId)
  if (!keyStore) throw new ApiError(StatusCodes.NOT_FOUND, 'Not found keyStore')

  try {
    const decodeUser = JWT.verify(accessToken, keyStore.privateKey)
    if (userId !== decodeUser.userId) throw new ApiError(StatusCodes.UNAUTHORIZED, 'Invalid user id')
    req.keyStore = keyStore
    return next()
  } catch (error) { throw error }
})

export {
  createTokenPair,
  authentication
}