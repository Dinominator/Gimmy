// gimmy/backend/middleware/authMiddleware.js
const { admin } = require('../config/firebaseConfig'); // Use admin to access auth functions
const jwt = require('jsonwebtoken');

const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify local JWT

      // Verify token with Firebase Auth (optional but recommended for backend validation)
      // This ensures the user exists in Firebase and the token wasn't revoked
      const decodedFirebaseToken = await admin.auth().verifyIdToken(token);
      req.user = decodedFirebaseToken; // Contains uid, email etc. from Firebase

      next();
    } catch (error) {
      console.error('Token verification failed:', error);
      if (error.code === 'auth/id-token-expired') {
          return res.status(401).json({ message: 'Token expired, please login again.' });
      }
      if (error.name === 'JsonWebTokenError') {
           return res.status(401).json({ message: 'Invalid token.' });
      }
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

module.exports = { protect };
