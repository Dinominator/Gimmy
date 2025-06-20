// gimmy/backend/routes/authRoutes.js
const express = require('express');
const { registerUser, loginUser, googleLogin, getUserProfile } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware'); // JWT verification middleware

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser); // Note: Read comments in controller about this endpoint
router.post('/google', googleLogin); // For Google Sign-In
router.get('/profile', protect, getUserProfile); // Protected route

module.exports = router;
