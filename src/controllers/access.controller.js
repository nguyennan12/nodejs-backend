import AccessService from '#services/access.service.js'
import { StatusCodes } from 'http-status-codes'

class AccessController {
  signUp = async (req, res, next) => {
    return res.status(StatusCodes.OK).json(await AccessService.signUp(req.body))
  }
}

export default new AccessController()