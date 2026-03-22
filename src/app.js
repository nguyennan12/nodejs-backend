import express from 'express'
import connectDB from './database/init.mongodb.js'
import Router from '#routers/index.js'
import { StatusCodes } from 'http-status-codes'
import errorMiddleware from '#middleware/error.middleware.js'
import ApiError from '#core/error.response.js'
const app = express()

await connectDB()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/', Router)

app.use((req, res, next) => {
  next(new ApiError(StatusCodes.NOT_FOUND, 'Not Found'))
})

app.use(errorMiddleware)

export default app