import { createClient } from 'redis'

export const client = createClient({
  // password: process.env.REDIS_PASSWORD,
  socket: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    tls: {}
  }
})

client.on('error', (err) => console.error('Redis Error:', err))
client.on('connect', () => console.log('Redis connected'))

await client.connect()

