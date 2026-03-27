import discountModel from '#models/discount.model.js'
import converter from '#utils/converter.js'
import { getSelectData, unGetSelectData } from '#utils/index.js'

const updateDiscount = async ({ discountId, shopId, reqBody }) => {
  return discountModel.findOneAndUpdate(
    {
      _id: converter.toObjectId(discountId),
      discount_shopId: converter.toObjectId(shopId),
      isDeleted: false
    },
    { $set: reqBody },
    { returnDocument: 'after' }
  )
}

const findDiscount = async (code, shopId) => {
  return await discountModel.findOne({ discount_code: code, discount_shopId: converter.toObjectId(shopId) }).lean()

}

const getAllDiscountUnSelect = async ({ limit, sort = 'ctime', skip, filter, unSelect }) => {
  const sortBy = sort === 'ctime' ? { _id: -1 } : { _id: 1 }
  const discounts = await discountModel
    .find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(unGetSelectData(unSelect))
    .lean()
  return discounts
}

const getAllDiscountSelect = async ({ limit, sort = 'ctime', skip, filter, select }) => {
  const sortBy = sort === 'ctime' ? { _id: -1 } : { _id: 1 }
  const discounts = await discountModel
    .find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(getSelectData(select))
    .lean()
  return discounts
}

const deleteDiscount = async ({ discountId, shopId }) => {
  return await discountModel.findOneAndUpdate(
    {
      _id: converter.toObjectId(discountId),
      discount_shopId: converter.toObjectId(shopId)
    },
    {
      $set: {
        isDeleted: true,
        deletedAt: new Date(),
        discount_is_active: false,
      }
    },
    { returnDocument: 'after' }
  )
}

const cancelDiscountWhenUsed = async (discountId, userId) => {
  return await discountModel.findByIdAndUpdate(discountId, {
    $pull: {
      discount_users_used: converter.toObjectId(userId),
    },
    $inc: {
      discount_max_uses: 1,
      discount_uses_count: -1
    }
  })
}

export default {
  updateDiscount,
  findDiscount,
  getAllDiscountUnSelect,
  getAllDiscountSelect,
  deleteDiscount,
  cancelDiscountWhenUsed
}

