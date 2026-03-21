/* eslint-disable no-unused-vars */
import ApiSuccess from '#core/success.response.js'
import AccessService from '#services/access.service.js'
import { StatusCodes } from 'http-status-codes'

class AccessController {
  signUp = async (req, res, next) => {
    new ApiSuccess({
      statusCode: StatusCodes.CREATED,
      message: 'Register successfully!',
      metadata: await AccessService.signUp(req.body)
    }).send(res)
  }

  login = async (req, res, next) => {
    new ApiSuccess({
      statusCode: StatusCodes.OK,
      message: 'Login successfully!',
      metadata: await AccessService.login(req.body)
    }).send(res)
  }

  logout = async (req, res, next) => {
    new ApiSuccess({
      statusCode: StatusCodes.OK,
      message: 'logout successfully!',
      metadata: await AccessService.logout(req.keyStore)
    }).send(res)
  }
}

export default new AccessController()