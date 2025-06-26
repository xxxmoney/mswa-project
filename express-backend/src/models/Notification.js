const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const notificationSchema = new mongoose.Schema({
  id: {
    type: String,
    default: () => uuidv4(),
    required: true,
    unique: true,
    index: true
  },
  type: {
    type: String,
    enum: ['CREATE', 'UPDATE', 'ARCHIVE'],
    required: true,
    index: true
  },
  entityType: {
    type: String,
    enum: ['Country', 'Currency'],
    required: true,
    index: true
  },
  entityId: {
    type: String,
    required: true,
    index: true
  },
  entityIdentifier: {
    type: String,
    required: true,
    index: true
  },
  message: {
    type: String,
    required: true
  },
  details: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  isRead: {
    type: Boolean,
    default: false,
    index: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    required: true,
    index: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Compound indexes for efficient querying
notificationSchema.index({ entityType: 1, entityIdentifier: 1 });
notificationSchema.index({ type: 1, createdAt: -1 });
notificationSchema.index({ isRead: 1, createdAt: -1 });

// Static method to create notification
notificationSchema.statics.createNotification = async function(data) {
  return await this.create(data);
};

// Static method to get notifications with pagination
notificationSchema.statics.getNotifications = function(filters = {}, pageInfo = {}) {
  const { pageIndex = 0, pageSize = 50 } = pageInfo;
  const skip = pageIndex * pageSize;
  
  return this.find(filters)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(pageSize);
};

// Static method to get unread notifications count
notificationSchema.statics.getUnreadCount = function(filters = {}) {
  return this.countDocuments({ ...filters, isRead: false });
};

// Static method to mark notifications as read
notificationSchema.statics.markAsRead = function(notificationIds) {
  return this.updateMany(
    { id: { $in: notificationIds } },
    { isRead: true }
  );
};

// Static method to mark all notifications as read
notificationSchema.statics.markAllAsRead = function(filters = {}) {
  return this.updateMany(
    { ...filters, isRead: false },
    { isRead: true }
  );
};

// Static method to get notifications by entity
notificationSchema.statics.getByEntity = function(entityType, entityIdentifier, pageInfo = {}) {
  const { pageIndex = 0, pageSize = 50 } = pageInfo;
  const skip = pageIndex * pageSize;
  
  return this.find({ entityType, entityIdentifier })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(pageSize);
};

module.exports = mongoose.model('Notification', notificationSchema); 