/* eslint-disable no-unused-vars */
import ApiSuccess from '#core/success.response.js'
import { StatusCodes } from 'http-status-codes'
import ProductService from '#services/product.service.js'

class ProductController {
  //===== CREATE =====
  creatProduct = async (req, res, next) => {
    new ApiSuccess({
      statusCode: StatusCodes.CREATED,
      message: 'craete Product successfully!',
      metadata: await ProductService.createProduct(req.body.product_type, {
        ...req.body,
        product_shop: req.user.userId
      })
    }).send(res)
  }

  //===== QUERY =====
  getAllDraftsForShop = async (req, res, next) => {
    new ApiSuccess({
      statusCode: StatusCodes.CREATED,
      message: 'Get  list Draft successfully!',
      metadata: await ProductService.findAllDraftsForShop({ product_shop: req.user.userId })
    }).send(res)
  }
}

export default new ProductController()