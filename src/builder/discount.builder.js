import { StatusCodes } from 'http-status-codes'
import ApiError from '#core/error.response.js'

class discountValidator {
  constructor(discountOrData) {

    this.discount = discountOrData
  }

  checkRequiredFields() {
    const required = ['discount_code', 'discount_name', 'discount_value', 'discount_start_date', 'discount_end_date']

    required.forEach(field => {
      if (!this.discount || !this.discount[field]) {
        throw new ApiError(StatusCodes.BAD_REQUEST, `Missing field: ${field}`)
      }
    })

    return this
  }

  checkNotExists() {
    if (this.discount && !this.discount.isDeleted) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Discount code already exists for your shop!')
    }
    return this
  }

  checkValidDate(startDate, endDate) {
    const start = new Date(startDate || this.discount.discount_start_date)
    const end = new Date(endDate || this.discount.discount_end_date)

    if (start >= end) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Start date must be before end date!')
    }
    return this
  }

  isActive() {
    if (!this.discount || !this.discount.discount_is_active) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Discount is no longer active!')
    }
    return this
  }

  hasUsesLeft() {
    const { discount_max_uses, discount_uses_count } = this.discount
    if (discount_uses_count >= discount_max_uses) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Discount has been fully used!')
    }
    return this
  }

  isNotExpired() {
    const now = new Date()
    const startDate = new Date(this.discount.discount_start_date)
    const endDate = new Date(this.discount.discount_end_date)

    if (now < startDate) throw new ApiError(StatusCodes.BAD_REQUEST, 'Discount is not yet valid!')
    if (now > endDate) throw new ApiError(StatusCodes.BAD_REQUEST, 'Discount has expired!')

    return this
  }

  checkMinOrder(totalOrderAmount) {
    if (this.discount.discount_min_order_value > 0 && totalOrderAmount < this.discount.discount_min_order_value) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        `Order must be at least ${this.discount.discount_min_order_value} to use this discount!`
      )
    }
    return this
  }

  checkUserLimit(userId) {
    if (this.discount.discount_max_uses_per_user > 0) {
      const userUsageCount = this.discount.discount_users_used.filter(id => id.toString() === userId.toString()).length

      if (userUsageCount >= this.discount.discount_max_uses_per_user) {
        throw new ApiError(StatusCodes.BAD_REQUEST, 'You have reached your limit for this code!')
      }
    }
    return this
  }
}

export default discountValidator