/* eslint-disable no-unused-vars */
import ApiSuccess from '#core/success.response.js'
import { StatusCodes } from 'http-status-codes'
import checkoutService from '#services/checkout.service.js'

class checkoutController {

  checkoutReview = async (req, res, next) => {
    new ApiSuccess({
      statusCode: StatusCodes.CREATED,
      message: 'show checkout review successfully!',
      metadata: await checkoutService.checkoutReview(req.body)
    }).send(res)
  }

}

export default new checkoutController()