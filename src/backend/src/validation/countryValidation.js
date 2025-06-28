const Joi = require('joi');

const countryValidation = {
  // Create country validation
  create: Joi.object({
    isoCode: Joi.string().min(2).max(10).uppercase().required(),
    name: Joi.string().min(1).max(100).required(),
    currencyIsoCode: Joi.string().length(3).uppercase().required(),
    validFrom: Joi.date().optional(),
    validTo: Joi.date().optional()
  }),

  // Get country validation
  get: Joi.object({
    isoCode: Joi.string().length(2).uppercase().required()
  }),

  // Update country validation
  update: Joi.object({
    isoCode: Joi.string().length(2).uppercase().required(),
    name: Joi.string().min(1).max(100).optional(),
    currencyIsoCode: Joi.string().length(3).uppercase().optional(),
    validFrom: Joi.date().optional()
  }),

  // Archive country validation
  archive: Joi.object({
    isoCode: Joi.string().length(2).uppercase().required()
  }),

  // List countries validation
  list: Joi.object({
    pageIndex: Joi.number().integer().min(0).default(0),
    pageSize: Joi.number().integer().min(1).max(100).default(50)
  }),

  // Get history validation
  getHistory: Joi.object({
    isoCode: Joi.string().min(2).max(10).uppercase().required(),
    pageIndex: Joi.number().integer().min(0).default(0),
    pageSize: Joi.number().integer().min(1).max(100).default(50)
  }),

  // List by currency validation
  listByCurrency: Joi.object({
    currencyIsoCode: Joi.string().length(3).uppercase().required(),
    pageIndex: Joi.number().integer().min(0).default(0),
    pageSize: Joi.number().integer().min(1).max(100).default(50)
  })
};

module.exports = countryValidation; 