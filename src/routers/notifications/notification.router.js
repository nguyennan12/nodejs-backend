import express from 'express'
import notificationController from '#controllers/notification.controller.js'
import asyncHandler from '#helpers/asyncHandler.js'
import { authentication } from '#auth/authUntils.js'


const Router = express.Router()
Router.use(authentication)
Router.get('', asyncHandler(notificationController.listNotiByUser))

export const notificationRouter = Router