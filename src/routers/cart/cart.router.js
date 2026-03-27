import express from 'express'
import cartController from '#controllers/cart.controller.js'
import asyncHandler from '#helpers/asyncHandler.js'


const Router = express.Router()

Router.post('', asyncHandler(cartController.addToCart))
Router.post('/update', asyncHandler(cartController.updateProductInCart))
Router.delete('', asyncHandler(cartController.deleteProductInCart))
Router.get('', asyncHandler(cartController.getListProductInCart))


export const cartRouter = Router