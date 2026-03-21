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
}

export default new AccessController()