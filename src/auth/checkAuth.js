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
      return res.status(StatusCodes.FORBIDDEN).json({
        message: 'forbidden error'
      })
    }
    //check objKey
    const objKey = await apiKeyService.findById(key)
    if (!objKey) {
      return res.status(StatusCodes.FORBIDDEN).json({
        message: 'forbidden error'
      })
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
      return res.status(StatusCodes.FORBIDDEN).json({
        message: 'permission denied'
      })
    }

    const validPermisson = req.objKey.permissions.includes(permission)
    if (!validPermisson) {
      return res.status(StatusCodes.FORBIDDEN).json({
        message: 'permission denied'
      })
    }

    return next()
  }
}

export {
  checkApiKey,
  checkPermission
}