import express from 'express'
import checkoutController from '#controllers/checkout.controller.js'
import asyncHandler from '#helpers/asyncHandler.js'


const Router = express.Router()

Router.post('/review', asyncHandler(checkoutController.checkoutReview))

export const checkoutRouter = Router