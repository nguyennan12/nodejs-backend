import express from 'express'
import accessController from '#controllers/access.controller.js'

const Router = express.Router()

//sign up
Router.post('/shop/signup', accessController.signUp)


export const accessRouter = Router