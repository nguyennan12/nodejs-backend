import ApiError from '#core/error.response.js'
import inventoryModel from '#models/inventory.model.js'
import productRepo from '#models/repository/product.repo.js'
import converter from '#utils/converter'
import { StatusCodes } from 'http-status-codes'

const addStockToInventory = async ({ stock, productId, shopId, location }) => {
  const product = productRepo.findProduct({ productId, unSelect: [] })
  if (!product) throw new ApiError(StatusCodes.BAD_REQUEST, 'The product does not exists')

  return await inventoryModel.findOneAndUpdate(
    {
      iven_productId: converter.toObjectId(productId),
      iven_shopId: converter.toObjectId(shopId)
    },
    {
      $inc: { iven_stock: stock },
      $set: { iven_location: location }
    },
    { upsert: true, new: true }
  )
}

export default {
  addStockToInventory
}