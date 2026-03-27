/* eslint-disable no-unused-vars */
import ApiSuccess from '#core/success.response.js'
import { StatusCodes } from 'http-status-codes'
import cartService from '#services/cart.service.js'

class cartController {

  addToCart = async (req, res, next) => {
    new ApiSuccess({
      statusCode: StatusCodes.CREATED,
      message: 'craete cart successfully!',
      metadata: await cartService.addToCart(req.body)
    }).send(res)
  }

  updateProductInCart = async (req, res, next) => {
    new ApiSuccess({
      statusCode: StatusCodes.OK,
      message: 'update cart successfully!',
      metadata: await cartService.updateProductInCart(req.body)
    }).send(res)
  }

  deleteProductInCart = async (req, res, next) => {
    new ApiSuccess({
      statusCode: StatusCodes.OK,
      message: 'delete cart successfully!',
      metadata: await cartService.deleteProductInCart(req.body)
    }).send(res)
  }

  getListProductInCart = async (req, res, next) => {
    new ApiSuccess({
      statusCode: StatusCodes.OK,
      message: 'delete cart successfully!',
      metadata: await cartService.getListProductInCart({ ...req.query })
    }).send(res)
  }
}

export default new cartController()