import express from 'express'
import { accessRouter } from './access/index.js'
import { checkApiKey, checkPermission } from '#auth/checkAuth.js'
import { productRouter } from './product/index.js'
import { discountRouter } from './discount/index.js'

const Router = express.Router()

//check api key
Router.use(checkApiKey)
//check permission
Router.use(checkPermission('0000'))


Router.use('/v1/api/product', productRouter)
Router.use('/v1/api/discount', discountRouter)
Router.use('/v1/api/shop', accessRouter)


export default Router