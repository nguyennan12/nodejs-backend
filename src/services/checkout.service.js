import ApiError from '#core/error.response.js'
import cartRepo from '#models/repository/cart.repo.js'
import productRepo from '#models/repository/product.repo.js'
import { StatusCodes } from 'http-status-codes'
import discountService from './discount.service.js'
import redisService from './redis.service.js'
import orderModel from '#models/order.model.js'
import cartService from './cart.service.js'


const checkoutReview = async ({ cartId, userId, shopOrders }) => {
  // 1. Kiểm tra giỏ hàng
  const foundCart = await cartRepo.findCartById(cartId)
  if (!foundCart) throw new ApiError(StatusCodes.BAD_REQUEST, 'Cart does not exist')

  //checkout total cua toan bo product trong cac shop da mua
  const checkoutOrder = {
    totalPrice: 0,
    feeShip: 0,
    totalDiscount: 0,
    totalCheckout: 0
  }

  // 2. Promise.all để xử lý tất cả shop cùng lúc
  const shopOrdersNew = await Promise.all(shopOrders.map(async (itemOrder) => {
    const { shopId, shop_discounts = [], item_products = [] } = itemOrder// từng cái chi tiet order product mình đặt trong 1 shop

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
          checkoutOrder.totalDiscount += discountAmount
          itemCheckout.priceApplyDiscount = Math.max(0, checkoutPrice - discountAmount)
        }
      }
    }

    // Cộng dồn vào tổng đơn hàng
    checkoutOrder.totalPrice += itemCheckout.priceRaw

    return itemCheckout
  }))

  // 4. Tính toán số tiền cuối cùng
  checkoutOrder.totalCheckout = checkoutOrder.totalPrice - checkoutOrder.totalDiscount
  //co the luu vao db tạm để lưu hành vi người dùng
  return {
    shopOrders,
    shopOrdersNew,
    checkoutOrder
  }
}

const orderByUser = async ({
  cartId, userId,
  shopOrders,
  shipping = {},
  payment = {}
}) => {
  const { shopOrdersNew, checkoutOrder } = await checkoutReview({ cartId, userId, shopOrders })

  //check xem vượt tồn kho hay k, flatMap là lấy phần tử dc chọn ra đưa vào mảng (ở đây là mảng item_products)
  const products = shopOrdersNew.flatMap(order => order.item_products)
  const acquireProduct = []
  for (const product of products) {
    const { productId, quantity } = product
    const KeyLock = await redisService.acquireLock(productId, quantity, cartId)
    acquireProduct.push(KeyLock ? true : false)
    if (KeyLock) {
      await redisService.releaseLock(KeyLock)
    }
  }

  //check neu co 1 product het han trong kho
  if (acquireProduct.includes(false))
    throw new ApiError(StatusCodes.BAD_REQUEST, 'some product acquired, please check again!')

  const newOrder = await orderModel.create({
    order_userId: userId,
    order_checkout: checkoutOrder,
    order_shipping: shipping,
    order_payment: payment,
    order_products: shopOrdersNew
  })
  //tao thanh cong thi remove all product trong cart
  if (newOrder) {
    await cartService.deleteAllProductInCart({ userId: newOrder.order_userId, products: order_products })
  }
  return newOrder
}

const getAllOrderByUser = () => {

}

const getOneOrderByUser = () => {

}

const cancelOrderByUser = () => {

}

//update status by shop, admin
const updateOrderStatusByShop = () => {

}

export default {
  checkoutReview,
  orderByUser
}