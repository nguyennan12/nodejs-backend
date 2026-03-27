import Joi from 'joi'

export const validateDiscount = (data) => {
  const schema = Joi.object({
    discount_name: Joi.string().required().messages('Discount name is required'),
    discount_description: Joi.string().required(),
    discount_type: Joi.string().valid('fixed_amount', 'percentage').default('fixed_amount'),
    discount_max_uses: Joi.number().integer().min(1).required(),
    discount_user_count: Joi.number().integer().default(0),
    discount_max_uses_per_user: Joi.number().integer().min(1).required(),
    discount_min_order_value: Joi.number().min(0).required(),

    discount_shopId: Joi.string().required(),
    discount_is_active: Joi.boolean().default(true),
    discount_applies_to: Joi.string().valid('all', 'specific').required(),

    discount_code: Joi.string().min(3).uppercase().required().messages('Discount code must be at least 3 characters'),
    discount_start_date: Joi.date().iso().required(),


    discount_end_date: Joi.date().iso().greater(Joi.ref('discount_start_date')).required().messages({
      'date.greater': 'End date must be after start date'
    }),
    discount_value: Joi.number().required().when('discount_type', {
      is: 'percentage',
      then: Joi.number().max(100).message('Percentage cannot exceed 100%'),
      otherwise: Joi.number().min(1).message('Discount value must be at least 1')
    }),
    discount_product_ids: Joi.array().items(Joi.string()).when('discount_applies_to', {
      is: 'specific',
      then: Joi.array().min(1).required().messages('Please provide at least one product ID for specific discount'),
      otherwise: Joi.array().max(0)
    })
  })

  return schema.validate(data, { abortEarly: false })
}