import cartModel from '#models/cart.model.js'


const createCart = async ({ userId, product }) => {
  return await cartModel.findOneAndUpdate(
    { cart_userId: userId, cart_state: 'active' },
    {
      $addToSet: { cart_products: product },
      $setOnInsert: { cart_count_product: 1 }
    },
    { upsert: true, returnDocument: 'after' }
  )
}

const updateCartQuantity = async ({ userId, product }) => {
  const { quantity, productId } = product
  return await cartModel.findOneAndUpdate(
    {
      cart_userId: userId,
      'cart_products.productId': productId,
      cart_state: 'active'
    },
    {
      $inc: {
        'cart_products.$.quantity': quantity
      }
    },
    { returnDocument: 'after' }
  )
}

const deleteCart = async ({ userId, productId }) => {
  return await cartModel.updateOne(
    { cart_userId: userId, cart_state: 'active' },
    {
      $pull: {
        cart_products: { productId }
      }
    },
  )
}

export default {
  createCart,
  updateCartQuantity,
  deleteCart
}