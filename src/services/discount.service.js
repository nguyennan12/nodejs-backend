import ApiError from '#core/error.response.js'
import discountModel from '#models/discount.model.js'
import { StatusCodes } from 'http-status-codes'
import { validateDiscount } from '#models/validations/discountValidation.js'
import discountRepo from '#models/repository/discount.repo'
import productRepo from '#models/repository/product.repo'
import converter from '#utils/converter'


const createDiscountCode = async (reqBody) => {

  const { error, value } = validateDiscount(reqBody)
  if (error) {
    const errorMessage = error.details.map(detail => detail.message).join(', ')
    throw new ApiError(StatusCodes.BAD_REQUEST, errorMessage)
  }

  const foundDiscount = await discountRepo.findDiscount(value.discount_code, value.discount_shopId)

  if (foundDiscount && foundDiscount.discount_is_active)
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Discount exists!')

  const newDiscount = discountModel.create({ ...value })

  return newDiscount
}

const updateDiscount = async (discountId, reqBody) => {
  return await discountRepo.updateDiscount({ discountId, reqBody })
}

const findAllProductsByDiscount = async ({ code, shopId, userId, limit, page }) => {
  const foundDiscount = await discountRepo.findDiscount(code, shopId)

  if (!foundDiscount || !foundDiscount.discount_is_active)
    throw new ApiError(StatusCodes.NOT_FOUND, 'Discount not exists!')

  let products
  const { discount_applies_to, discount_product_ids } = foundDiscount
  if (discount_applies_to == 'all') {
    products = await productRepo.findAllProducts({
      filter: {
        product_shop: converter.toObjectId(shopId),
        isPublished: true
      },
      limit: +limit,
      page: +page,
      sort: 'ctime',
      select: ['product_name']
    })
  }
  if (discount_applies_to == 'specific') {
    products = productRepo.findAllProducts({
      filter: {
        _id: { $in: discount_product_ids },
        isPublished: true
      },
      limit: +limit,
      page: +page,
      sort: 'ctime',
      select: ['product_name']
    })
  }
  return products
}

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

export default {
  createDiscountCode,
  updateDiscount,
  findAllProductsByDiscount,
  getAllDiscountForShop
}