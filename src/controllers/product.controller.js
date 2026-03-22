/* eslint-disable no-unused-vars */
import ApiSuccess from '#core/success.response.js'
import { StatusCodes } from 'http-status-codes'
import ProductService from '#services/product.service.js'

class ProductController {
  creatProduct = async (req, res, next) => {
    new ApiSuccess({
      statusCode: StatusCodes.CREATED,
      message: 'craete Product successfully!',
      metadata: await ProductService.creatProduct(req.body.product_type, req.body)
    }).send(res)
  }

}

export default new ProductController()