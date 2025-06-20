// gimmy/backend/controllers/notificationController.js
const { db } = require('../config/firebaseConfig');

// Helper to create a notification
const createNotification = async (userId, type, message, relatedEntityId = null) => {
  try {
    const notification = {
      userId,
      type,
      message,
      relatedEntityId,
      isRead: false,
      createdAt: new Date().toISOString(),
    };
    await db.collection('notifications').add(notification);
    console.log(`Notification created for ${userId}: ${type}`);
  } catch (error) {
    console.error(`Error creating notification for ${userId}:`, error);
  }
};

// Get unread notifications for the logged-in user
const getUnreadNotifications = async (req, res) => {
  const userId = req.user.uid;
  try {
    const notificationsSnapshot = await db.collection('notifications')
      .where('userId', '==', userId)
      .where('isRead', '==', false)
      .orderBy('createdAt', 'desc')
      .limit(20) // Get recent unread notifications
      .get();

    const notifications = notificationsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(notifications);
  } catch (error) {
    console.error('Error getting unread notifications:', error);
    res.status(500).json({ message: 'Error getting notifications', error: error.message });
  }
};

// Mark a notification as read
const markNotificationAsRead = async (req, res) => {
  const userId = req.user.uid;
  const { notificationId } = req.params;
  try {
    const notificationRef = db.collection('notifications').doc(notificationId);
    const notificationDoc = await notificationRef.get();

    if (!notificationDoc.exists || notificationDoc.data().userId !== userId) {
      return res.status(404).json({ message: 'Notification not found or not authorized.' });
    }

    await notificationRef.update({ isRead: true });
    res.status(200).json({ message: 'Notification marked as read.' });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({ message: 'Error updating notification', error: error.message });
  }
};

// Mark all unread notifications as read
const markAllNotificationsAsRead = async (req, res) => {
  const userId = req.user.uid;
  try {
      const unreadNotificationsSnapshot = await db.collection('notifications')
          .where('userId', '==', userId)
          .where('isRead', '==', false)
          .get();

      if (unreadNotificationsSnapshot.empty) {
          return res.status(200).json({ message: 'No unread notifications to mark as read.' });
      }

      const batch = db.batch();
      unreadNotificationsSnapshot.docs.forEach(doc => {
          batch.update(doc.ref, { isRead: true });
      });
      await batch.commit();

      res.status(200).json({ message: 'All unread notifications marked as read.' });
  } catch (error) {
      console.error('Error marking all notifications as read:', error);
      res.status(500).json({ message: 'Error updating notifications', error: error.message });
  }
};

module.exports = {
  createNotification, // Export for internal use by other controllers
  getUnreadNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
};
