import express from 'express'
import inventoryController from '#controllers/inventory.controller.js'
import asyncHandler from '#helpers/asyncHandler.js'
import { authentication } from '#auth/authUntils.js'


const Router = express.Router()
Router.use(authentication)
Router.post('', asyncHandler(inventoryController.addStockToInventory))

export const inventoryRouter = Router