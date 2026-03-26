import discountModel from '#models/discount.model'
import converter from '#utils/converter'
import { getSelectData, unGetSelectData } from '#utils'

const updateDiscount = async ({ discountId, reqBody }) => {
  return discountModel.findByIdAndUpdate(discountId, reqBody, { returnDocument: 'after' })
}

const findDiscount = async (code, shopId) => {
  return (await discountModel.findOne({ discount_code: code, discount_shopId: converter.toObjectId(shopId) })).lean()
}

const getAllDiscountUnSelect = async ({ limit, sort = 'ctime', filter, unSelect }) => {
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

const getAllDiscountSelect = async ({ limit, sort = 'ctime', filter, select }) => {
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

export default {
  updateDiscount,
  findDiscount,
  getAllDiscountUnSelect,
  getAllDiscountSelect
}

