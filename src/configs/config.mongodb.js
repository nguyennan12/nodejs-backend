import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config({ path: path.resolve(__dirname, '../.env') })

// 1. Cấu hình cho môi trường DEV
const dev = {
  app: { port: process.env.DEV_APP_PORT || 3000 },
  db: {
    url: process.env.DEV_MONGODB_URI,
    maxPoolSize: parseInt(process.env.DEV_MONGODB_MAX_POOL_SIZE) || 5
  }
}

// 2. Cấu hình cho môi trường PRO
const pro = {
  app: { port: process.env.PRO_APP_PORT || 8080 },
  db: {
    url: process.env.PRO_MONGODB_URI,
    maxPoolSize: parseInt(process.env.PRO_MONGODB_MAX_POOL_SIZE) || 50
  }
}

const config = { dev, pro }
const env = process.env.NODE_ENV || 'dev'

export default config[env]