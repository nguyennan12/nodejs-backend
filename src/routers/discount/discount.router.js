import express from 'express'
import discountController from '#controllers/discount.controller.js'
import asyncHandler from '#helpers/asyncHandler.js'
import { authentication } from '#auth/authUntils.js'

const Router = express.Router()


Router.post('/amount', asyncHandler(discountController.getDiscountAmout))
Router.get('/list_product/', asyncHandler(discountController.findAllProductsByDiscount))
Router.get('', asyncHandler(discountController.getAllDiscountForShop))
Router.post('/:discountId', asyncHandler(discountController.cancelDiscountWhenUsed))

//authentication
Router.use(authentication)

Router.put('/:discountId', asyncHandler(discountController.updateDiscount))
Router.post('', asyncHandler(discountController.createDiscountCode))
Router.delete('/:discountId', asyncHandler(discountController.deleteDiscount))


export const discountRouter = Router