import mongoose from 'mongoose'
import config from '#configs/config.mongodb.js'

const { url, maxPoolSize } = config.db

const connectDB = async () => {
  try {
    if (!url) {
      throw new Error('Missing MongoDB URL. Check .env and NODE_ENV config.')
    }

    await mongoose.connect(url, { maxPoolSize })
    console.log('MongoDB connected')
  } catch (err) {
    console.error('MongoDB connection error:', err.message)
    process.exit(1)
  }
}

export default connectDB