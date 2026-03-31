import ApiError from '#core/error.response.js'
import { StatusCodes } from 'http-status-codes'
import rbacConfig from '#configs/rbac.config.js'
import rbacService from '#services/rbac.service.js'


const grantAccess = (action, resource) => {
  return async (req, res, next) => {
    try {
      rbacConfig.setGrants(await rbacService.roleList({
        userId: 99
      }))
      const role_name = req.query.role
      const permission = rbacConfig.can(role_name)[action](resource)
      if (!permission.granted) throw new ApiError(StatusCodes.UNAUTHORIZED, 'You do not have enough permission...')
      next()
    } catch (error) {
      next(error)
    }
  }
}

export default grantAccess