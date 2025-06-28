const express = require('express');
const notificationController = require('../controllers/notificationController');

const router = express.Router();

// All routes require id parameter (UUID) except list and create
router.param('id', (req, res, next, id) => {
  req.params.id = id;
  next();
});

// Notification routes
router.get('/', notificationController.getNotifications);
router.get('/unread-count', notificationController.getUnreadCount);
router.get('/:id', notificationController.getById);
router.get('/entity/:entityType/:entityIdentifier', notificationController.getByEntity);
router.put('/mark-read', notificationController.markAsRead);
router.put('/mark-all-read', notificationController.markAllAsRead);
router.delete('/:id', notificationController.deleteById);

module.exports = router; 