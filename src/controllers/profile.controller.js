/* eslint-disable no-unused-vars */
import ApiSuccess from '#core/success.response.js'
import { StatusCodes } from 'http-status-codes'
import checkoutService from '#services/checkout.service.js'

const dataProfiles = [
  {
    user_id: 1,
    user_name: 'an',
    user_avatar: 'avatar.jpg'
  },
  {
    user_id: 2,
    user_name: 'bao',
    user_avatar: 'avatar.jpg'
  },
  {
    user_id: 3,
    user_name: 'trang',
    user_avatar: 'avatar.jpg'
  }
]

class profileController {

  profiles = async (req, res, next) => {
    new ApiSuccess({
      statusCode: StatusCodes.OK,
      message: 'view on profiles!',
      metadata: dataProfiles
    }).send(res)
  }

  profile = async (req, res, next) => {
    new ApiSuccess({
      statusCode: StatusCodes.OK,
      message: 'view one profile!',
      metadata: {
        user_id: 3,
        user_name: 'trang',
        user_avatar: 'avatar.jpg'
      }
    }).send(res)
  }

}

export default new profileController()