import express from 'express'
import { accessRouter } from './access/index.js'

const Router = express.Router()

Router.use('/v1/api', accessRouter)

export default Router