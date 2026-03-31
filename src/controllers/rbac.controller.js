/* eslint-disable no-unused-vars */
import ApiSuccess from '#core/success.response.js'
import { StatusCodes } from 'http-status-codes'
import permissionService from '#services/rbac.service.js'

class rbacController {

  newRole = async (req, res, next) => {
    new ApiSuccess({
      statusCode: StatusCodes.OK,
      message: 'create role successfully!',
      metadata: await permissionService.createRole(req.body)
    }).send(res)
  }
  listRoles = async (req, res, next) => {
    new ApiSuccess({
      statusCode: StatusCodes.OK,
      message: 'get roles successfully!',
      metadata: await permissionService.roleList(req.query)
    }).send(res)
  }

  newResource = async (req, res, next) => {
    new ApiSuccess({
      statusCode: StatusCodes.OK,
      message: 'create resource successfully!',
      metadata: await permissionService.createResource(req.body)
    }).send(res)
  }

  listResources = async (req, res, next) => {
    new ApiSuccess({
      statusCode: StatusCodes.OK,
      message: 'get resources successfully!',
      metadata: await permissionService.resourceList(req.query)
    }).send(res)
  }

}

export default new rbacController()