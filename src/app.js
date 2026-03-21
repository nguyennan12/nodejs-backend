import express from 'express'
import connectDB from './database/init.mongodb.js'
import Router from '#routers/index.js'

const app = express()

await connectDB()

app.use(express.json())
// app.use(express.urlencoded({ extended: true }))

app.use('/', Router)

export default app