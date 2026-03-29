/* eslint-disable no-unused-vars */
import ApiSuccess from '#core/success.response.js'
import { StatusCodes } from 'http-status-codes'
import notiificationService from '#services/notiification.service.js'

class notificationController {

  listNotiByUser = async (req, res, next) => {
    console.log('🚀 ~ notificationController ~ req.query:', req.query)
    new ApiSuccess({
      statusCode: StatusCodes.OK,
      message: 'add stock successfully!',
      metadata: await notiificationService.listNotiByUser(req.query)
    }).send(res)
  }
}

export default new notificationController()