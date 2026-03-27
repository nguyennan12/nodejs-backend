import ApiError from '#core/error.response.js'
import cartRepo from '#models/repository/cart.repo.js'
import productRepo from '#models/repository/product.repo.js'
import { StatusCodes } from 'http-status-codes'
import discountService from './discount.service.js'


const checkoutReview = async ({ cartId, userId, shop_order_ids }) => {
  // 1. Kiểm tra giỏ hàng
  const foundCart = await cartRepo.findCartById(cartId)
  if (!foundCart) throw new ApiError(StatusCodes.BAD_REQUEST, 'Cart does not exist')

  //checkout total cua toan bo product trong cac shop da mua
  const checkout_order = {
    totalPrice: 0,
    feeShip: 0,
    totalDiscount: 0,
    totalCheckout: 0
  }

  // 2. Promise.all để xử lý tất cả shop cùng lúc
  const shop_order_ids_new = await Promise.all(shop_order_ids.map(async (orderDetail) => {
    const { shopId, shop_discounts = [], item_products = [] } = orderDetail

    // Kiểm tra sản phẩm từ server
    const checkProductServer = await productRepo.checkProductByServer(item_products)
    if (!checkProductServer[0]) throw new ApiError(StatusCodes.BAD_REQUEST, 'Order invalid')

    // Tính tổng tiền shop này
    const checkoutPrice = checkProductServer.reduce((acc, product) => {
      return acc + (product.quantity * product.price)
    }, 0)
    //checkout cua 1 shop trong cac shop da order
    let itemCheckout = {
      shopId,
      shop_discounts,
      priceRaw: checkoutPrice,
      priceApplyDiscount: checkoutPrice,
      item_products: checkProductServer
    }

    // 3. Xử lý Discount
    if (shop_discounts.length > 0) {
      for (const discount of shop_discounts) {
        const { discountAmount = 0 } = await discountService.getDiscountAmout({
          code: discount.code,
          userId,
          shopId: discount.shopId,
          products: checkProductServer
        })

        if (discountAmount > 0) {
          checkout_order.totalDiscount += discountAmount
          itemCheckout.priceApplyDiscount = Math.max(0, checkoutPrice - discountAmount)
        }
      }
    }

    // Cộng dồn vào tổng đơn hàng
    checkout_order.totalPrice += itemCheckout.priceRaw

    return itemCheckout
  }))

  // 4. Tính toán số tiền cuối cùng
  checkout_order.totalCheckout = checkout_order.totalPrice - checkout_order.totalDiscount

  return {
    shop_order_ids,
    shop_order_ids_new,
    checkout_order
  }
}

export default {
  checkoutReview
}