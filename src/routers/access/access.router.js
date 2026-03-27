import express from 'express'
import accessController from '#controllers/access.controller.js'
import asyncHandler from '#helpers/asyncHandler.js'
import { authentication } from '#auth/authUntils.js'

const Router = express.Router()

//sign up
Router.post('/signup', asyncHandler(accessController.signUp))
//login
Router.post('/login', asyncHandler(accessController.login))
//authentication
Router.use(authentication)
//logout
Router.post('/logout', asyncHandler(accessController.logout))
//refresh token
Router.post('/handlerRefreshToken', asyncHandler(accessController.handlerRefreshToken))

export const accessRouter = Router