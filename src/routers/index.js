import express from 'express'
import { accessRouter } from './access/access.router.js'
import { checkApiKey, checkPermission } from '#auth/checkAuth.js'
import { productRouter } from './product/product.router.js'
import { discountRouter } from './discount/discount.router.js'
import { cartRouter } from './cart/cart.router.js'
import { checkoutRouter } from './checkout/checkout.router.js'
import { inventoryRouter } from './inventory/inventory.router.js'
import { pushToLogDiscord } from '#middleware/discord.log.middleware.js'
import { commentRouter } from './comment/comment.router.js'
import { notificationRouter } from './notifications/notification.router.js'
import { uploadRouter } from './upload/upload.router.js'
import { profileRouter } from './profile/profile.router.js'
import { rbacRouter } from './rbac/rbac.router.js'

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
Router.use('/v1/api/comment', commentRouter)
Router.use('/v1/api/notification', notificationRouter)
Router.use('/v1/api/upload', uploadRouter)
Router.use('/v1/api/profile', profileRouter)
Router.use('/v1/api/rbac', rbacRouter)


export default Router