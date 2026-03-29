import ApiError from '#core/error.response.js'
import { commentModel } from '#models/comment.model.js'
import productRepo from '#models/repository/product.repo.js'
import converter from '#utils/converter.js'
import { StatusCodes } from 'http-status-codes'

const createComment = async ({ productId, userId, content, parentCommentId }) => {
  const comment = new commentModel({
    comment_productId: productId,
    comment_userId: userId,
    comment_content: content,
    comment_parentId: parentCommentId
  })
  let rightValue
  if (parentCommentId) {
    const parentComment = await commentModel.findById(parentCommentId)
    if (!parentComment) throw new ApiError(StatusCodes.BAD_REQUEST, 'comment not found')
    rightValue = parentComment.comment_right

    await commentModel.updateMany(
      {
        comment_productId: converter.toObjectId(productId),
        comment_right: { $gte: rightValue }
      }, { $inc: { comment_right: 2 } }
    )

    await commentModel.updateMany(
      {
        comment_productId: converter.toObjectId(productId),
        comment_left: { $gt: rightValue }
      }, { $inc: { comment_left: 2 } }
    )
  }
  else {
    const maxRightValue = await commentModel.findOne(
      { comment_productId: converter.toObjectId(productId) },
      'comment_right',
      { sort: { comment_right: -1 } }
    )
    if (maxRightValue) {
      rightValue = maxRightValue.comment_right + 1
    }
    else {
      rightValue = 1
    }
  }
  comment.comment_left = rightValue
  comment.comment_right = rightValue + 1

  await comment.save()
  return comment
}

const getCommentsByParentId = async ({ productId, parentCommentId = null, limit = 50, offset = 0 }) => {
  if (parentCommentId) {
    const parent = await commentModel.findById(parentCommentId)
    if (!parent) throw new ApiError(StatusCodes.BAD_REQUEST, 'comment not found')
    const comments = await commentModel.find({
      comment_productId: converter.toObjectId(productId),
      comment_left: { $gt: parent.comment_left },
      comment_right: { $lte: parent.comment_right },
      isDeleted: false
    }).select({
      comment_left: 1, comment_right: 1, comment_content: 1, comment_parentId: 1
    }).sort({ comment_left: 1 })
    return comments
  }
  const comments = await commentModel.find({
    comment_productId: converter.toObjectId(productId),
    comment_parentId: parentCommentId,
    isDeleted: false
  }).select({
    comment_left: 1, comment_right: 1, comment_content: 1, comment_parentId: 1
  }).sort({ comment_left: 1 })
  return comments
}

const delteteComment = async ({ commentId, productId }) => {
  const foundProduct = await productRepo.findProduct({ product_id: productId })
  if (!foundProduct) throw new ApiError(StatusCodes.BAD_REQUEST, 'product not found')

  const comment = await commentModel.findById(commentId)
  if (!comment) throw new ApiError(StatusCodes.BAD_REQUEST, 'comment not found')

  const leftValue = comment.comment_left
  const rightValue = comment.comment_right
  const width = rightValue - leftValue + 1

  await commentModel.updateMany(
    {
      comment_productId: converter.toObjectId(productId),
      comment_left: { $gte: leftValue, $lte: rightValue },
      isDeleted: false
    },
    { $set: { isDeleted: true } }
  )

  await commentModel.updateMany(
    {
      comment_productId: converter.toObjectId(productId),
      isDeleted: false,
      comment_right: { $gt: rightValue }
    },
    { $inc: { comment_right: -width } }
  )
  await commentModel.updateMany(
    {
      comment_productId: converter.toObjectId(productId),
      isDeleted: false,
      comment_left: { $gt: rightValue }
    },
    { $inc: { comment_left: -width } }
  )

  return true
}

export default {
  createComment,
  getCommentsByParentId,
  delteteComment
}