/* eslint-disable no-unused-vars */
import ApiSuccess from '#core/success.response.js'
import { StatusCodes } from 'http-status-codes'
import uploadService from '#services/upload.service.js'
import ApiError from '#core/error.response.js'

class uploadController {

  uploadFile = async (req, res, next) => {
    new ApiSuccess({
      statusCode: StatusCodes.OK,
      message: 'upload file successfully!',
      metadata: await uploadService.uploadImageFromUtl()
    }).send(res)
  }
  uploadFileThumb = async (req, res, next) => {
    const { file } = req
    if (!file) throw new ApiError(StatusCodes.BAD_REQUEST, 'file not found')
    new ApiSuccess({
      statusCode: StatusCodes.OK,
      message: 'apload thumb successfully!',
      metadata: await uploadService.uploadImageFromLocal({ path: file.path })
    }).send(res)
  }
  uploadMultiFileThumb = async (req, res, next) => {
    const { files } = req
    if (!files.length) throw new ApiError(StatusCodes.BAD_REQUEST, 'file not found')
    new ApiSuccess({
      statusCode: StatusCodes.OK,
      message: 'apload thumb successfully!',
      metadata: await uploadService.uploadMultiImageFromLocal({ files })
    }).send(res)
  }
}

export default new uploadController()