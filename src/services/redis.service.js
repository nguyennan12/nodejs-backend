import { client } from '#configs/redis.config.js'
import inventoryRepo from '#models/repository/inventory.repo.js'
import { v4 as uuidv4 } from 'uuid'

const acquireLock = async (productId, quantity, cartId) => {
  const key = `lock:${productId}`
  const token = uuidv4()
  const expireTime = 3000
  const retryTimes = 10

  for (let i = 0; i < retryTimes; i++) {
    // Dùng Redis v4: setNX trả về boolean
    const result = await client.setNX(key, token)
    if (result) {
      // thao tac voi inventory
      const isReservation = await inventoryRepo.reservationInventory({ productId, quantity, cartId })
      if (isReservation.modifiedCount) {
        // set thời gian hết hạn
        await client.pExpire(key, expireTime)
        return { key, token }
      } else {
        // nếu thao tác thất bại thì xóa khóa ngay
        await client.del(key)
        return null
      }
    }

    // thử lại sau 50ms nếu bị khóa
    await new Promise(r => setTimeout(r, 50))
  }

  return null
}

const releaseLock = async ({ key, token }) => {
  const current = await client.get(key)
  if (current === token) {
    await client.del(key)
    return true
  }
  return false
}

export default {
  acquireLock,
  releaseLock
}