import inventoryModel from '#models/inventory.model.js'


const insertInventory = async ({ productId, shopId, stock, location = 'unkonw' }) => {
  return inventoryModel.create({
    iven_productId: productId,
    iven_shopId: shopId,
    iven_stock: stock,
    iven_location: location,
  })
}

export default {
  insertInventory
}