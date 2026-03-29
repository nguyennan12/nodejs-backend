import inventoryModel from '#models/inventory.model.js'
import converter from '#utils/converter.js'


const insertInventory = async ({ productId, shopId, stock, location = 'unkonw' }) => {
  return inventoryModel.create({
    iven_productId: productId,
    iven_shopId: shopId,
    iven_stock: stock,
    iven_location: location,
  })
}

//giữ chỗ tồn kho va trừ
const reservationInventory = async ({ productId, quantity, cartId }) => {
  return await inventoryModel.updateOne(
    {
      iven_productId: converter.toObjectId(productId),
      iven_stock: { $gte: quantity }
    },
    {
      $inc: { iven_stock: -quantity },
      $push: {
        iven_reservations: {
          quantity, cartId, createOn: new Date()
        }
      }
    },
    {
      upsert: true, new: true
    }
  )
}

export default {
  insertInventory,
  reservationInventory
}