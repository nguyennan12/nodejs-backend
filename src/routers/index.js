import express from 'express'
import { accessRouter } from './access/access.router.js'
import { checkApiKey, checkPermission } from '#auth/checkAuth.js'
import { productRouter } from './product/product.router.js'
import { discountRouter } from './discount/discount.router.js'
import { cartRouter } from './cart/cart.router.js'
import { checkoutRouter } from './checkout/checkout.router.js'
import { inventoryRouter } from './inventory/inventory.router.js'
import { pushToLogDiscord } from '#middleware/discord.log.middleware.js'

const Router = express.Router()

//add log to discord
Router.use(pushToLogDiscord)
//check api key
Router.use(checkApiKey)
//check permission
Router.use(checkPermission('0000'))

Router.use('/v1/api/checkout', checkoutRouter)
Router.use('/v1/api/product', productRouter)
Router.use('/v1/api/cart', cartRouter)
Router.use('/v1/api/inventory', inventoryRouter)
Router.use('/v1/api/discount', discountRouter)
Router.use('/v1/api/shop', accessRouter)


export default Router