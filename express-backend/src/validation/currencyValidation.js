const Joi = require('joi');

const currencyValidation = {
  // Create currency validation
  create: Joi.object({
    isoCode: Joi.string().length(3).uppercase().required(),
    name: Joi.string().min(1).max(100).required(),
    symbol: Joi.string().min(1).max(10).optional(),
    validFrom: Joi.date().optional(),
    validTo: Joi.date().optional()  
  }),

  // Get currency validation
  get: Joi.object({
    isoCode: Joi.string().length(3).uppercase().required()
  }),

  // Update currency validation
  update: Joi.object({
    isoCode: Joi.string().length(3).uppercase().required(),
    name: Joi.string().min(1).max(100).optional(),
    validFrom: Joi.date().optional()
  }),

  // Archive currency validation
  archive: Joi.object({
    isoCode: Joi.string().length(3).uppercase().required()
  }),

  // List currencies validation
  list: Joi.object({
    pageIndex: Joi.number().integer().min(0).default(0),
    pageSize: Joi.number().integer().min(1).max(100).default(50)
  }),

  // Get history validation
  getHistory: Joi.object({
    isoCode: Joi.string().length(3).uppercase().required(),
    pageIndex: Joi.number().integer().min(0).default(0),
    pageSize: Joi.number().integer().min(1).max(100).default(50)
  })
};

module.exports = currencyValidation; 