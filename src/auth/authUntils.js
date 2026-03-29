import ApiError from '#core/error.response.js'
import asyncHandler from '#helpers/asyncHandler.js'
import KeyTokenService from '#services/keyToken.service.js'
import { StatusCodes } from 'http-status-codes'
import JWT from 'jsonwebtoken'
const HEADER = {
  API_KEY: 'x-api-key',
  CLIENT_ID: 'x-client-id',
  AUTHORIZATION: 'authorization',
  REFRESHTOKEN: 'x-rtoken-id'
}

const parseBearerToken = (tokenValue) => {
  if (!tokenValue || typeof tokenValue !== 'string') return null
  const token = tokenValue.trim()
  if (!token) return null
  return token.startsWith('Bearer ') ? token.slice(7).trim() : token
}

const createTokenPair = async (payload, publicKey, privateKey) => {
  try {


    const accessToken = JWT.sign(payload, privateKey, {
      algorithm: 'RS256',
      expiresIn: '30 days'
    })

    const refreshToken = JWT.sign(payload, privateKey, {
      algorithm: 'RS256',
      expiresIn: '30 days'
    })
    return { accessToken, refreshToken }
  } catch (error) {
    throw error
  }
}


const authentication = asyncHandler(async (req, res, next) => {
  const userId = req.headers[HEADER.CLIENT_ID]
  if (!userId) throw new ApiError(StatusCodes.UNAUTHORIZED, 'Invalid Request')

  const keyStore = await KeyTokenService.findByUserId(userId)
  if (!keyStore) throw new ApiError(StatusCodes.NOT_FOUND, 'Not found keyStore')

  const refreshToken = req.headers[HEADER.REFRESHTOKEN]
  if (refreshToken) {
    const decodeUser = verifyJWT(refreshToken, keyStore.publicKey)
    if (userId !== decodeUser.userId) throw new ApiError(StatusCodes.UNAUTHORIZED, 'Invalid user id')
    req.keyStore = keyStore
    req.user = decodeUser
    req.refreshToken = refreshToken
    return next()
  }

  const accessToken = parseBearerToken(req.headers[HEADER.AUTHORIZATION])
  if (!accessToken) throw new ApiError(StatusCodes.UNAUTHORIZED, 'Invalid Request')
  const decodeUser = verifyJWT(accessToken, keyStore.publicKey)
  if (userId !== decodeUser.userId) throw new ApiError(StatusCodes.UNAUTHORIZED, 'Invalid user id')
  req.keyStore = keyStore
  req.user = decodeUser

  return next()
})


const verifyJWT = (token, keySecret) => {
  try {
    return JWT.verify(token, keySecret, { algorithms: ['RS256'] })
  } catch (error) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, 'Invalid token signature')
  }
}
export {
  createTokenPair,
  authentication,
  verifyJWT
}