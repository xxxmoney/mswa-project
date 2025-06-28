const Notification = require('../models/Notification');
const notificationValidation = require('../validation/notificationValidation');

const notificationController = {
  // Get all notifications with filters and pagination
  async getNotifications(req, res, next) {
    try {
      const { error } = notificationValidation.getNotifications.validate(req.query);
      if (error) {
        return res.status(400).json({
          success: false,
          error: error.details[0].message
        });
      }

      const { pageIndex, pageSize, type, entityType, isRead } = req.query;
      
      // Build filters
      const filters = {};
      if (type) filters.type = type;
      if (entityType) filters.entityType = entityType;
      if (isRead !== undefined) filters.isRead = isRead === 'true';

      const notifications = await Notification.getNotifications(filters, { pageIndex, pageSize });
      const totalCount = await Notification.countDocuments(filters);
      const unreadCount = await Notification.getUnreadCount();

      res.json({
        success: true,
        data: {
          notifications,
          pagination: {
            pageIndex: parseInt(pageIndex) || 0,
            pageSize: parseInt(pageSize) || 50,
            totalCount,
            totalPages: Math.ceil(totalCount / (parseInt(pageSize) || 50))
          },
          unreadCount
        }
      });
    } catch (error) {
      next(error);
    }
  },

  // Get notification by ID
  async getById(req, res, next) {
    try {
      const { error } = notificationValidation.getById.validate(req.params);
      if (error) {
        return res.status(400).json({
          success: false,
          error: error.details[0].message
        });
      }

      const { id } = req.params;
      const notification = await Notification.findOne({ id });

      if (!notification) {
        return res.status(404).json({
          success: false,
          error: 'Notification not found'
        });
      }

      res.json({
        success: true,
        data: notification
      });
    } catch (error) {
      next(error);
    }
  },

  // Get notifications by entity
  async getByEntity(req, res, next) {
    try {
      const { error } = notificationValidation.getByEntity.validate(req.params);
      if (error) {
        return res.status(400).json({
          success: false,
          error: error.details[0].message
        });
      }

      const { entityType, entityIdentifier } = req.params;
      const { pageIndex, pageSize } = req.query;

      const notifications = await Notification.getByEntity(
        entityType, 
        entityIdentifier, 
        { pageIndex, pageSize }
      );

      const totalCount = await Notification.countDocuments({ entityType, entityIdentifier });

      res.json({
        success: true,
        data: {
          notifications,
          pagination: {
            pageIndex: parseInt(pageIndex) || 0,
            pageSize: parseInt(pageSize) || 50,
            totalCount,
            totalPages: Math.ceil(totalCount / (parseInt(pageSize) || 50))
          }
        }
      });
    } catch (error) {
      next(error);
    }
  },

  // Mark notifications as read
  async markAsRead(req, res, next) {
    try {
      const { error } = notificationValidation.markAsRead.validate(req.body);
      if (error) {
        return res.status(400).json({
          success: false,
          error: error.details[0].message
        });
      }

      const { notificationIds } = req.body;
      const result = await Notification.markAsRead(notificationIds);

      res.json({
        success: true,
        data: {
          message: `Marked ${result.modifiedCount} notifications as read`,
          modifiedCount: result.modifiedCount
        }
      });
    } catch (error) {
      next(error);
    }
  },

  // Mark all notifications as read
  async markAllAsRead(req, res, next) {
    try {
      const { error } = notificationValidation.markAllAsRead.validate(req.body);
      if (error) {
        return res.status(400).json({
          success: false,
          error: error.details[0].message
        });
      }

      const filters = {};
      if (req.body.type) filters.type = req.body.type;
      if (req.body.entityType) filters.entityType = req.body.entityType;

      const result = await Notification.markAllAsRead(filters);

      res.json({
        success: true,
        data: {
          message: `Marked ${result.modifiedCount} notifications as read`,
          modifiedCount: result.modifiedCount
        }
      });
    } catch (error) {
      next(error);
    }
  },

  // Get unread notifications count
  async getUnreadCount(req, res, next) {
    try {
      const filters = {};
      if (req.query.type) filters.type = req.query.type;
      if (req.query.entityType) filters.entityType = req.query.entityType;

      const unreadCount = await Notification.getUnreadCount(filters);

      res.json({
        success: true,
        data: {
          unreadCount
        }
      });
    } catch (error) {
      next(error);
    }
  },

  // Delete notification by ID
  async deleteById(req, res, next) {
    try {
      const { error } = notificationValidation.getById.validate(req.params);
      if (error) {
        return res.status(400).json({
          success: false,
          error: error.details[0].message
        });
      }

      const { id } = req.params;
      const notification = await Notification.findOneAndDelete({ id });

      if (!notification) {
        return res.status(404).json({
          success: false,
          error: 'Notification not found'
        });
      }

      res.json({
        success: true,
        data: {
          message: 'Notification deleted successfully'
        }
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = notificationController; 