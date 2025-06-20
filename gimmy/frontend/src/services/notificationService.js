// src/services/notificationService.js
import axios from 'axios'; // Using the global axios instance configured in AuthContext

const API_URL = import.meta.env.VITE_API_URL;

// Get unread notifications for the logged-in user
export const getUnreadNotifications = async () => {
  try {
    // Axios instance should already have Authorization header if user is logged in
    const response = await axios.get(`${API_URL}/notifications`);
    return response.data;
  } catch (error) {
    console.error('Error fetching unread notifications:', error.response?.data?.message || error.message);
    throw error;
  }
};

// Mark a specific notification as read
export const markNotificationAsRead = async (notificationId) => {
  try {
    const response = await axios.patch(`${API_URL}/notifications/${notificationId}/read`);
    return response.data;
  } catch (error) {
    console.error(`Error marking notification ${notificationId} as read:`, error.response?.data?.message || error.message);
    throw error;
  }
};

// Mark all unread notifications for the logged-in user as read
export const markAllNotificationsAsRead = async () => {
  try {
    const response = await axios.patch(`${API_URL}/notifications/read-all`);
    return response.data;
  } catch (error) {
    console.error('Error marking all notifications as read:', error.response?.data?.message || error.message);
    throw error;
  }
};
