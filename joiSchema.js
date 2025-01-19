const joi = require('joi')

const productSchema = joi.object({
    name:joi.string() .required(),
    img:joi.string() .required(),
    price:joi.number() .min(0) .required(),
    desc: joi.string() .required()
})

const reviewSchema = joi.object({
    rating:joi.string() .required(),
    comment:joi.string() .required(),
})

module.exports = {productSchema, reviewSchema}