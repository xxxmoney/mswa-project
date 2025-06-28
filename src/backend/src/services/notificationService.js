const Notification = require('../models/Notification');

class NotificationService {
  // Create notification for record creation
  static async createCreationNotification(entityType, entityId, entityIdentifier, details = {}) {
    try {
      const message = this.generateCreationMessage(entityType, entityIdentifier);
      
      await Notification.createNotification({
        type: 'CREATE',
        entityType,
        entityId,
        entityIdentifier,
        message,
        details: {
          ...details,
          action: 'created',
          timestamp: new Date()
        }
      });
    } catch (error) {
      console.error('Error creating creation notification:', error);
      // Don't throw error to avoid breaking the main operation
    }
  }

  // Create notification for record update
  static async createUpdateNotification(entityType, entityId, entityIdentifier, details = {}) {
    try {
      const message = this.generateUpdateMessage(entityType, entityIdentifier);
      
      await Notification.createNotification({
        type: 'UPDATE',
        entityType,
        entityId,
        entityIdentifier,
        message,
        details: {
          ...details,
          action: 'updated',
          timestamp: new Date()
        }
      });
    } catch (error) {
      console.error('Error creating update notification:', error);
      // Don't throw error to avoid breaking the main operation
    }
  }

  // Create notification for record archivation
  static async createArchiveNotification(entityType, entityId, entityIdentifier, details = {}) {
    try {
      const message = this.generateArchiveMessage(entityType, entityIdentifier);
      
      await Notification.createNotification({
        type: 'ARCHIVE',
        entityType,
        entityId,
        entityIdentifier,
        message,
        details: {
          ...details,
          action: 'archived',
          timestamp: new Date()
        }
      });
    } catch (error) {
      console.error('Error creating archive notification:', error);
      // Don't throw error to avoid breaking the main operation
    }
  }

  // Generate message for creation notification
  static generateCreationMessage(entityType, entityIdentifier) {
    switch (entityType) {
      case 'Country':
        return `New country "${entityIdentifier}" has been created`;
      case 'Currency':
        return `New currency "${entityIdentifier}" has been created`;
      default:
        return `New ${entityType.toLowerCase()} "${entityIdentifier}" has been created`;
    }
  }

  // Generate message for update notification
  static generateUpdateMessage(entityType, entityIdentifier) {
    switch (entityType) {
      case 'Country':
        return `Country "${entityIdentifier}" has been updated`;
      case 'Currency':
        return `Currency "${entityIdentifier}" has been updated`;
      default:
        return `${entityType} "${entityIdentifier}" has been updated`;
    }
  }

  // Generate message for archive notification
  static generateArchiveMessage(entityType, entityIdentifier) {
    switch (entityType) {
      case 'Country':
        return `Country "${entityIdentifier}" has been archived`;
      case 'Currency':
        return `Currency "${entityIdentifier}" has been archived`;
      default:
        return `${entityType} "${entityIdentifier}" has been archived`;
    }
  }

  // Create notification with custom message
  static async createCustomNotification(type, entityType, entityId, entityIdentifier, message, details = {}) {
    try {
      await Notification.createNotification({
        type,
        entityType,
        entityId,
        entityIdentifier,
        message,
        details: {
          ...details,
          timestamp: new Date()
        }
      });
    } catch (error) {
      console.error('Error creating custom notification:', error);
      // Don't throw error to avoid breaking the main operation
    }
  }
}

module.exports = NotificationService; 