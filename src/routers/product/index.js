import express from 'express'
import productController from '#controllers/product.controller.js'
import asyncHandler from '#helpers/asyncHandler.js'
import { authentication } from '#auth/authUntils.js'

const Router = express.Router()

//authentication
Router.use(authentication)

Router.post('', asyncHandler(productController.creatProduct))

//query
Router.get('/drafts/all', asyncHandler(productController.getAllDraftsForShop))

export const productRouter = Router