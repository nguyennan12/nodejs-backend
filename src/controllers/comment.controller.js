/* eslint-disable no-unused-vars */
import ApiSuccess from '#core/success.response.js'
import { StatusCodes } from 'http-status-codes'
import commentService from '#services/comment.service.js'

class commentController {

  createComment = async (req, res, next) => {
    new ApiSuccess({
      statusCode: StatusCodes.CREATED,
      message: 'create comment successfully!',
      metadata: await commentService.createComment(req.body)
    }).send(res)
  }
  getCommentsByParentId = async (req, res, next) => {
    new ApiSuccess({
      statusCode: StatusCodes.CREATED,
      message: 'create comment successfully!',
      metadata: await commentService.getCommentsByParentId(req.query)
    }).send(res)
  }
  delteteComment = async (req, res, next) => {
    new ApiSuccess({
      statusCode: StatusCodes.CREATED,
      message: 'create comment successfully!',
      metadata: await commentService.delteteComment(req.query)
    }).send(res)
  }

}

export default new commentController()