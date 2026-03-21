import express from 'express'
import accessController from '#controllers/access.controller.js'
import asyncHandler from '#helpers/asyncHandler.js'

const Router = express.Router()

//sign up
Router.post('/shop/signup', asyncHandler(accessController.signUp))


export const accessRouter = Router