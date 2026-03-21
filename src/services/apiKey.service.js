import apiKeyModel from '#models/apiKey.model.js'
import crypto from 'crypto'

const findById = async (key) => {
  // const newKey = await apiKeyModel.create({ key: crypto.randomBytes(64).toString('hex'), permissions: ['0000'] })
  // console.log('🚀 ~ findById ~ newKey:', newKey)
  const objKey = await apiKeyModel.findOne({ key, status: true }).lean()
  return objKey
}

export const apiKeyService = {
  findById
}