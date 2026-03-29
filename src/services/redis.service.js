import { setnxAsync, pexpireAsync, getAsync, delAsync } from '#config/redis.js'
import inventoryRepo from '#models/repository/inventory.repo.js'
import { v4 as uuidv4 } from 'uuid'

const acquireLock = async (productId, quantity, cartId) => {
  const key = `lock:${productId}`
  const token = uuidv4()
  const expireTime = 3000
  const retryTimes = 10

  //đang khóa mà có người khác vào thì sẽ thử 10 lần
  for (let i = 0; i < retryTimes; i++) {
    const result = await setnxAsync(key, token)
    if (result === 1) {
      //thao tac voi inventory
      const isReversation = await inventoryRepo.reservationInventory({ productId, quantity, cartId })
      if (isReversation.modifiedCount) {
        await pexpireAsync(key, expireTime)
        return { key, token }
      }
    }
    //thử kh dc thì thử lại sao 50ms
    await new Promise(r => setTimeout(r, 50))
  }
  return null
}

const releaseLock = async ({ key, token }) => {
  const current = await getAsync(key)
  if (current === token) {
    await delAsync(key)
    return true
  }
  return false
}

export default {
  acquireLock,
  releaseLock
}