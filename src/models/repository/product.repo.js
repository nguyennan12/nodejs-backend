import { productModel, electronicModel, clothingModel, furnitureModel } from '#models/product.model.js'

const findAllDraftsForShop = async ({ query, limit, skip }) => {
  return await productModel.find(query)
    .populate('product_shop', 'name email -_id')
    .sort({ updateAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean()
    .exec()
}

export {
  findAllDraftsForShop
}