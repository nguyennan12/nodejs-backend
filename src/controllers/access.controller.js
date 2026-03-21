import AccessService from '#services/access.service.js'
import { StatusCodes } from 'http-status-codes'

class AccessController {
  signUp = async (req, res, next) => {
    try {
      console.log('sign up: ', req.body)
      return res.status(StatusCodes.OK).json(await AccessService.signUp(req.body))
    } catch (error) {
      next(error)
    }
  }
}

export default new AccessController()