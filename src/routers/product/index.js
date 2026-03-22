import express from 'express'
import productController from '#controllers/product.controller.js'
import asyncHandler from '#helpers/asyncHandler.js'

const Router = express.Router()

//authentication
Router.use(authentication)

Router.post('', asyncHandler(productController.creatProduct))


export const productRouter = Router