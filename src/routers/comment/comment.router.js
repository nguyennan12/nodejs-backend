import express from 'express'
import commentController from '#controllers/comment.controller.js'
import asyncHandler from '#helpers/asyncHandler.js'
import { authentication } from '#auth/authUntils.js'


const Router = express.Router()
Router.use(authentication)
Router.post('', asyncHandler(commentController.createComment))
Router.get('', asyncHandler(commentController.getCommentsByParentId))
Router.delete('', asyncHandler(commentController.delteteComment))

export const commentRouter = Router