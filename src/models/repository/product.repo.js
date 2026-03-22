import { productModel } from '#models/product.model.js'
import { Types } from 'mongoose'
import { getSelectData, unGetSelectData } from '#utils/index.js'

const queryProduct = async ({ query, limit, skip }) => {
  return await productModel.find(query)
    .populate('product_shop', 'name email -_id')
    .sort({ updateAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean()
    .exec()
}

const searchProducts = async ({ keySearch }) => {
  const results = await productModel.find(
    {
      $text: { $search: keySearch },
      isDraft: false
    },
    {
      score: { $meta: 'textScore' }
    }
  )
    .sort({ score: { $meta: 'textScore' } })
    .lean()

  return results
}

const publishProductByShop = async ({ product_shop, product_id }) => {
  const product = await productModel.findOneAndUpdate(
    {
      product_shop: new Types.ObjectId(product_shop),
      _id: new Types.ObjectId(product_id)
    },
    {
      $set: { isDraft: false, isPublished: true }

    },
    {
      new: true, runValidators: true
    }
  )
  if (!product) return null
  return product
}
const unPublishProductByShop = async ({ product_shop, product_id }) => {
  const product = await productModel.findOneAndUpdate(
    {
      product_shop: new Types.ObjectId(product_shop),
      _id: new Types.ObjectId(product_id)
    },
    {
      $set: { isDraft: true, isPublished: false }

    },
    {
      new: true, runValidators: true
    }
  )
  if (!product) return null
  return product
}

const findAllProducts = async ({ limit, sort, page, filter, select }) => {
  const skip = (page - 1) * limit
  const sortBy = sort === 'ctime' ? { _id: -1 } : { _id: 1 }
  const products = await productModel
    .find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(getSelectData(select))
    .lean()
  return products
}

const findProduct = async ({ product_id, unSelect }) => {
  return await productModel.findById(product_id).select(unGetSelectData(unSelect))
}

export default {
  publishProductByShop,
  unPublishProductByShop,
  queryProduct,
  searchProducts,
  findAllProducts,
  findProduct
}
