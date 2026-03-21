import ApiError from '#core/error.response.js'
import { apiKeyService } from '#services/apiKey.service.js'
import { StatusCodes } from 'http-status-codes'

const HEADER = {
  API_KEY: 'x-api-key',
  AUTHORIZATION: 'authorization'
}

const checkApiKey = async (req, res, next) => {
  try {
    const key = req.headers[HEADER.API_KEY]?.toString()
    if (!key) {
      throw new ApiError(StatusCodes.FORBIDDEN, 'forbidden error')
    }
    //check objKey
    const objKey = await apiKeyService.findById(key)
    if (!objKey) {
      throw new ApiError(StatusCodes.FORBIDDEN, 'forbidden error')
    }

    req.objKey = objKey
    return next()

  } catch (error) {
    next(error)
  }
}

const checkPermission = (permission) => {
  return (req, res, next) => {
    if (!req.objKey || !req.objKey.permissions) {
      throw new ApiError(StatusCodes.FORBIDDEN, 'permission denied')
    }

    const validPermisson = req.objKey.permissions.includes(permission)
    if (!validPermisson) {
      throw new ApiError(StatusCodes.FORBIDDEN, 'permission denied')
    }

    return next()
  }
}

export {
  checkApiKey,
  checkPermission
}