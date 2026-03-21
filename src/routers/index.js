import express from 'express'
import { accessRouter } from './access/index.js'
import { checkApiKey, checkPermission } from '#auth/checkAuth.js'

const Router = express.Router()

//check api key
Router.use(checkApiKey)
//check permission
Router.use(checkPermission('0000'))

Router.use('/v1/api', accessRouter)

export default Router