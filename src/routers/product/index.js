import express from 'express'
import productController from '#controllers/product.controller.js'
import asyncHandler from '#helpers/asyncHandler.js'
import { authentication } from '#auth/authUntils.js'

const Router = express.Router()

Router.get('/search/', asyncHandler(productController.searchProducts))
//authentication
Router.use(authentication)

//create
Router.post('', asyncHandler(productController.creatProduct))

//update
Router.put('/publish/:id', asyncHandler(productController.publishProductByShop))
Router.put('/unpublish/:id', asyncHandler(productController.unPublishProductByShop))

//query
Router.get('/drafts/all', asyncHandler(productController.getAllDraftsForShop))
Router.get('/published/all', asyncHandler(productController.getAllPublishForShop))

export const productRouter = Router