import redis from 'redis'
import { promisify } from 'util'

const client = redis.createClient({
  host: '127.0.0.1',
  port: 6379
})

// promisify các lệnh Redis
//lay value ra
const getAsync = promisify(client.get).bind(client)
//set value
const setAsync = promisify(client.set).bind(client)
//xoa value
const delAsync = promisify(client.del).bind(client)
//not exists: chi set khi chua ton tai
const setnxAsync = promisify(client.setnx).bind(client)
//set thoi gian
const pexpireAsync = promisify(client.pexpire).bind(client)

client.on('error', (err) => console.error('Redis Error:', err))
client.on('connect', () => console.log('Redis connected'))

export { client, getAsync, setAsync, delAsync, setnxAsync, pexpireAsync }