import express from 'express'
import profileController from '#controllers/profile.controller.js'
import grantAccess from '#middleware/rbac.middleware.js'

const Router = express.Router()

//admin
Router.get('/viewAny', grantAccess('readAny', 'profile'), profileController.profiles)

//shop
Router.get('/viewOwn', grantAccess('readOwn', 'profile'), profileController.profile)

export const profileRouter = Router