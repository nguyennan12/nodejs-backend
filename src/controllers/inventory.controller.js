/* eslint-disable no-unused-vars */
import ApiSuccess from '#core/success.response.js'
import { StatusCodes } from 'http-status-codes'
import inventoryService from '#services/inventory.service.js'

class checkoutController {

  addStockToInventory = async (req, res, next) => {
    new ApiSuccess({
      statusCode: StatusCodes.OK,
      message: 'add stock successfully!',
      metadata: await inventoryService.addStockToInventory(req.body)
    }).send(res)
  }
}

export default new checkoutController()