const Joi = require('joi');

const currencyValidation = {
  // Create currency validation
  create: Joi.object({
    id: Joi.string().uuid().optional(),
    isoCode: Joi.string().length(3).uppercase().required(),
    name: Joi.string().min(1).max(100).required(),
    validFrom: Joi.date().optional(),
    validTo: Joi.date().optional()
  }),

  // Get currency validation
  get: Joi.object({
    id: Joi.string().uuid().required(),
    isoCode: Joi.string().length(3).uppercase().required()
  }),

  // Update currency validation
  update: Joi.object({
    id: Joi.string().uuid().required(),
    isoCode: Joi.string().length(3).uppercase().required(),
    name: Joi.string().min(1).max(100).optional(),
    validFrom: Joi.date().optional()
  }),

  // Archive currency validation
  archive: Joi.object({
    id: Joi.string().uuid().required(),
    isoCode: Joi.string().length(3).uppercase().required()
  }),

  // List currencies validation
  list: Joi.object({
    id: Joi.string().uuid().required(),
    pageIndex: Joi.number().integer().min(0).default(0),
    pageSize: Joi.number().integer().min(1).max(100).default(50)
  }),

  // Get history validation
  getHistory: Joi.object({
    id: Joi.string().uuid().required(),
    isoCode: Joi.string().length(3).uppercase().required(),
    pageIndex: Joi.number().integer().min(0).default(0),
    pageSize: Joi.number().integer().min(1).max(100).default(50)
  })
};

module.exports = currencyValidation; 