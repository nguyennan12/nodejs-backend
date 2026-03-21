import express from 'express'
import accessController from '#controllers/access.controller.js'
import asyncHandler from '#helpers/asyncHandler.js'

const Router = express.Router()

//sign up
Router.post('/shop/signup', asyncHandler(accessController.signUp))
//login
Router.post('/shop/login', asyncHandler(accessController.login))


export const accessRouter = Router