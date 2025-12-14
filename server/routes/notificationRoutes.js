const express = require('express');
const router = express.Router();
const {
    getNotifications,
    markRead,
    markAllRead,
    deleteNotification,
    createNotification
} = require('../controllers/notificationController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
    .get(protect, getNotifications)
    .post(protect, createNotification);

router.route('/read-all')
    .put(protect, markAllRead);

router.route('/:id/read')
    .put(protect, markRead);

router.route('/:id')
    .delete(protect, deleteNotification);

module.exports = router;
