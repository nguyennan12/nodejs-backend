import express from 'express'
import uploadController from '#controllers/upload.controller.js'
import asyncHandler from '#helpers/asyncHandler.js'
import { authentication } from '#auth/authUntils.js'
import uploadDisk from '#configs/multer.config.js'


const Router = express.Router()
// Router.use(authentication)
Router.post('/product', asyncHandler(uploadController.uploadFile))
Router.post('/product/thumb', uploadDisk.single('file'), asyncHandler(uploadController.uploadFileThumb))
Router.post('/product/multiple', uploadDisk.array('files', 3), asyncHandler(uploadController.uploadMultiFileThumb))

export const uploadRouter = Router