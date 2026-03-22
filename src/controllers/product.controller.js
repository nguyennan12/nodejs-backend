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
  //===== UPDATE =====
  publishProductByShop = async (req, res, next) => {
    new ApiSuccess({
      statusCode: StatusCodes.CREATED,
      message: 'Publish product successfully!',
      metadata: await ProductService.publishProductByShop({
        product_id: req.params.id,
        product_shop: req.user.userId
      })
    }).send(res)
  }
  unPublishProductByShop = async (req, res, next) => {
    new ApiSuccess({
      statusCode: StatusCodes.CREATED,
      message: 'Unpublic product successfully!',
      metadata: await ProductService.unPublishProductByShop({
        product_id: req.params.id,
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
  getAllPublishForShop = async (req, res, next) => {
    new ApiSuccess({
      statusCode: StatusCodes.CREATED,
      message: 'Get  list published successfully!',
      metadata: await ProductService.findAllPublishForShop({ product_shop: req.user.userId })
    }).send(res)
  }
  searchProducts = async (req, res, next) => {
    new ApiSuccess({
      statusCode: StatusCodes.CREATED,
      message: 'Search product successfully!',
      metadata: await ProductService.searchProducts(req.query)
    }).send(res)
  }
}

export default new ProductController()