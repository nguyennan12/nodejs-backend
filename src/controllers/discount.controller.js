/* eslint-disable no-unused-vars */
import ApiSuccess from '#core/success.response.js'
import { StatusCodes } from 'http-status-codes'
import discountService from '#services/discount.service.js'

class discountController {
  //===== CREATE =====
  createDiscountCode = async (req, res, next) => {
    new ApiSuccess({
      statusCode: StatusCodes.CREATED,
      message: 'craete Discount successfully!',
      metadata: await discountService.createDiscountCode({
        shopId: req.user.userId,
        reqBody: req.body
      })
    }).send(res)
  }

  updateDiscount = async (req, res, next) => {
    new ApiSuccess({
      statusCode: StatusCodes.OK,
      message: 'craete Discount successfully!',
      metadata: await discountService.updateDiscount({
        discountId: req.params.discountId,
        shopId: req.user.userId,
        reqBody: req.body
      })
    }).send(res)
  }

  getDiscountAmout = async (req, res, next) => {
    new ApiSuccess({
      statusCode: StatusCodes.OK,
      message: 'found discount of shop successfully!',
      metadata: await discountService.getDiscountAmout({ ...req.body })
    }).send(res)
  }

  findAllProductsByDiscount = async (req, res, next) => {
    new ApiSuccess({
      statusCode: StatusCodes.OK,
      message: 'found discount of product successfully!',
      metadata: await discountService.findAllProductsByDiscount({ ...req.query })
    }).send(res)
  }

  getAllDiscountForShop = async (req, res, next) => {
    new ApiSuccess({
      statusCode: StatusCodes.OK,
      message: 'found discount of shop successfully!',
      metadata: await discountService.getAllDiscountForShop({ ...req.query })
    }).send(res)
  }

  deleteDiscount = async (req, res, next) => {
    new ApiSuccess({
      statusCode: StatusCodes.OK,
      message: 'found discount of product successfully!',
      metadata: await discountService.deleteDiscount({
        discountId: req.params.discountId,
        shopId: req.user.userId
      })
    }).send(res)
  }

  cancelDiscountWhenUsed = async (req, res, next) => {
    new ApiSuccess({
      statusCode: StatusCodes.OK,
      message: 'found discount of product successfully!',
      metadata: await discountService.cancelDiscountWhenUsed({
        ...req.query,
        shopId: req.user.userId
      })
    }).send(res)
  }

}

export default new discountController()