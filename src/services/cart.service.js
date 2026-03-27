import ApiError from '#core/error.response.js'
import cartModel from '#models/cart.model.js'
import cartRepo from '#models/repository/cart.repo.js'
import productRepo from '#models/repository/product.repo.js'
import { StatusCodes } from 'http-status-codes'


const addToCart = async ({ userId, product = {} }) => {

  const userCart = await cartModel.findOne({ cart_userId: userId })
  //checl user co cart chua
  if (!userCart) {
    return await cartRepo.createCart({ userId, product })
  }

  const foundProduct = userCart.cart_products.find(p => p.productId === product.productId)
  //co cart r ma chua co product
  if (!foundProduct) {
    return await cartModel.findOneAndUpdate(
      { cart_userId: userId, cart_state: 'active' },
      {
        $push: { cart_products: product },
        $inc: { cart_count_product: 1 }
      },
      { new: true, upsert: true }
    )
  }

  //co cart va product torng cart roi
  return await cartRepo.updateCartQuantity({ userId, product })

}

const updateProductInCart = async ({ userId, shop_order_ids }) => {
  const { productId, quantity, old_quantity } = shop_order_ids[0]?.item_products[0]
  const foundProduct = await productRepo.findProduct({ product_id: productId, unSelect: [] })
  if (!foundProduct) throw new ApiError(StatusCodes.NOT_FOUND, 'product not exists!')

  if (foundProduct.product_shop.toString() != shop_order_ids[0].shopId)
    throw new ApiError(StatusCodes.NOT_FOUND, 'product do not belong to the shpop!')

  if (quantity === 0) {

  }
  return await cartRepo.updateCartQuantity({
    userId,
    product: {
      productId,
      quantity: quantity - old_quantity
    }
  })
}

const deleteProductInCart = async ({ userId, productId }) => {
  return await cartRepo.deleteCart({ userId, productId })
}

//lay cart trong do co list product
const getListProductInCart = ({ userId }) => {
  return cartModel.findOne({ cart_userId: userId }).lean()
}

export default {
  addToCart,
  updateProductInCart,
  deleteProductInCart,
  getListProductInCart
}