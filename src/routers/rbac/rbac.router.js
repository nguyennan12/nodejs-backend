import express from 'express'
import rbacController from '#controllers/rbac.controller.js'
import asyncHandler from '#helpers/asyncHandler.js'

const Router = express.Router()

Router.post('/role', asyncHandler(rbacController.newRole))
Router.get('/roles', asyncHandler(rbacController.listRoles))

Router.post('/resource', asyncHandler(rbacController.newResource))
Router.get('/resources', asyncHandler(rbacController.listResources))

export const rbacRouter = Router