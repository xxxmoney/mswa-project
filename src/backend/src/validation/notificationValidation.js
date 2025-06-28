const Joi = require('joi');

const notificationValidation = {
  // Get notifications validation
  getNotifications: Joi.object({
    pageIndex: Joi.number().integer().min(0).default(0),
    pageSize: Joi.number().integer().min(1).max(100).default(50),
    type: Joi.string().valid('CREATE', 'UPDATE', 'ARCHIVE').optional(),
    entityType: Joi.string().valid('Country', 'Currency').optional(),
    isRead: Joi.boolean().optional()
  }),

  // Get notifications by entity validation
  getByEntity: Joi.object({
    entityType: Joi.string().valid('Country', 'Currency').required(),
    entityIdentifier: Joi.string().required(),
    pageIndex: Joi.number().integer().min(0).default(0),
    pageSize: Joi.number().integer().min(1).max(100).default(50)
  }),

  // Mark notifications as read validation
  markAsRead: Joi.object({
    notificationIds: Joi.array().items(Joi.string().uuid()).min(1).required()
  }),

  // Mark all notifications as read validation
  markAllAsRead: Joi.object({
    type: Joi.string().valid('CREATE', 'UPDATE', 'ARCHIVE').optional(),
    entityType: Joi.string().valid('Country', 'Currency').optional()
  }),

  // Get notification by ID validation
  getById: Joi.object({
    id: Joi.string().uuid().required()
  })
};

module.exports = notificationValidation; 