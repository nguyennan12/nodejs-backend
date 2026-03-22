/* eslint-disable no-unused-vars */
import ApiSuccess from '#core/success.response.js'
import { StatusCodes } from 'http-status-codes'
import ProductFatory from '#services/product.service.js'

class ProductController {
  creatProduct = async (req, res, next) => {
    new ApiSuccess({
      statusCode: StatusCodes.CREATED,
      message: 'craete Product successfully!',
      metadata: await ProductFatory.createProduct(req.body.product_type, {
        ...req.body,
        product_shop: req.user.userId
      })
    }).send(res)
  }

}

export default new ProductController()