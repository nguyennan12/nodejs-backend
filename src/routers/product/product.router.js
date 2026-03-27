import express from 'express'
import productController from '#controllers/product.controller.js'
import asyncHandler from '#helpers/asyncHandler.js'
import { authentication } from '#auth/authUntils.js'

const Router = express.Router()

Router.get('/search/', asyncHandler(productController.searchProducts))
Router.get('', asyncHandler(productController.findAllProducts))
Router.get('/:productId', asyncHandler(productController.findProduct))
//authentication
Router.use(authentication)

//create
Router.post('', asyncHandler(productController.creatProduct))

Router.patch('/:productId', asyncHandler(productController.updateProduct))

//update
Router.post('/publish/:id', asyncHandler(productController.publishProductByShop))
Router.post('/unpublish/:id', asyncHandler(productController.unPublishProductByShop))

//query
Router.get('/drafts/all', asyncHandler(productController.getAllDraftsForShop))
Router.get('/published/all', asyncHandler(productController.getAllPublishForShop))

export const productRouter = Router