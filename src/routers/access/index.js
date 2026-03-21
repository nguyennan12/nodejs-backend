import express from 'express'
import accessController from '#controllers/access.controller.js'
import asyncHandler from '#helpers/asyncHandler.js'
import { authentication } from '#auth/authUntils.js'

const Router = express.Router()

//sign up
Router.post('/shop/signup', asyncHandler(accessController.signUp))
//login
Router.post('/shop/login', asyncHandler(accessController.login))
//authentication
Router.use(authentication)
//logout
Router.post('/shop/logout', asyncHandler(accessController.logout))
Router.post('/shop/handlerRefreshToken', asyncHandler(accessController.handlerRefreshToken))

export const accessRouter = Router