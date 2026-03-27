import ApiError from '#core/error.response.js'
import discountModel from '#models/discount.model.js'
import { StatusCodes } from 'http-status-codes'
import discountRepo from '#models/repository/discount.repo.js'
import productRepo from '#models/repository/product.repo.js'
import converter from '#utils/converter.js'
import discountValidator from '#builder/discount.builder.js'


//create discount
const createDiscountCode = async ({ shopId, reqBody }) => {
  new discountValidator(reqBody)
    .checkRequiredFields()
    .checkValidDate()

  const foundDiscount = await discountRepo.findDiscount(reqBody.discount_code, shopId)

  if (foundDiscount && foundDiscount.discount_is_active) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Discount code already exists for your shop!')
  }

  const newDiscount = await discountModel.create({
    ...reqBody,
    discount_shopId: converter.toObjectId(shopId),
  })

  return newDiscount
}

//update discount
const updateDiscount = async ({ discountId, shopId, reqBody }) => {
  const updatedDiscount = await discountRepo.updateDiscount({ discountId, shopId, reqBody })
  return updatedDiscount
}

//find discount of product
const findAllProductsByDiscount = async ({ code, shopId, limit = 50, page = 1 }) => {
  const foundDiscount = await discountRepo.findDiscount(code, shopId)

  if (!foundDiscount || !foundDiscount.discount_is_active)
    throw new ApiError(StatusCodes.NOT_FOUND, 'Discount not exists!')

  const { discount_applies_to, discount_product_ids } = foundDiscount

  const filter = {
    product_shop: converter.toObjectId(shopId),
    isPublished: true,
    ...(discount_applies_to === 'specific' && { _id: { $in: discount_product_ids } })
  }

  return await productRepo.findAllProducts({
    filter,
    limit: +limit,
    page: +page,
    sort: 'ctime',
    select: ['product_name']
  })
}


//find all discount of shop
const getAllDiscountForShop = async ({ limit = 50, page = 1, shopId }) => {
  const skip = (page - 1) * limit
  const discounts = await discountRepo.getAllDiscountUnSelect({
    limit: +limit,
    skip: +skip,
    filter: {
      discount_shopId: converter.toObjectId(shopId),
      discount_is_active: true
    },
    unSelect: ['__v', 'discount_shopId']
  })
  return discounts
}

//get price of discount
const getDiscountAmout = async ({ code, userId, shopId, products }) => {
  const foundDiscount = await discountRepo.findDiscount(code, shopId)

  if (!foundDiscount)
    throw new ApiError(StatusCodes.NOT_FOUND, 'Discount not exists!')

  const totalOrder = products.reduce((acc, { quantity, price }) => acc + (quantity * price), 0)

  new discountValidator(foundDiscount)
    .isActive()
    .hasUsesLeft()
    .isNotExpired()
    .checkMinOrder(totalOrder)
    .checkUserLimit(userId)

  const { discount_type, discount_value } = foundDiscount
  const amount = discount_type === 'fixed_amount'
    ? discount_value
    : totalOrder * (discount_value / 100)


  return { totalOrder, discountAmount: amount, totalPrice: totalOrder - amount }
}

const deleteDiscount = async ({ discountId, shopId }) => {
  const deletedDiscount = await discountRepo.deleteDiscount({ discountId, shopId })
  if (!deletedDiscount) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Discount not found or already deleted!')
  }
  return deletedDiscount
}

const cancelDiscountWhenUsed = async ({ shopId, code, userId }) => {
  const foundDiscount = await discountRepo.findDiscount({ shopId, code })
  if (!foundDiscount)
    throw new ApiError(StatusCodes.NOT_FOUND, 'Discount not exists!')

  return await discountRepo.cancelDiscountWhenUsed(foundDiscount._id, userId)
}

export default {
  createDiscountCode,
  updateDiscount,
  findAllProductsByDiscount,
  getAllDiscountForShop,
  getDiscountAmout,
  deleteDiscount,
  cancelDiscountWhenUsed

}