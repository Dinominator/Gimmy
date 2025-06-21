// gimmy/backend/middleware/authMiddleware.js
const { db } = require('../config/firebaseConfig'); // Import db to fetch user details if needed
const jwt = require('jsonwebtoken');

const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];

      // Verify our custom JWT
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach basic user information (UID) from our custom token to the request object
      // More detailed user info (like role, name) will be fetched from Firestore
      // by controllers if they need it, using this UID.
      // This is a common pattern when not using Firebase ID tokens directly for session auth.
      req.user = { uid: decoded.uid };
      // Example: If you need full user profile available in all protected routes, fetch here:
      // const userDoc = await db.collection('users').doc(decoded.uid).get();
      // if (!userDoc.exists) {
      //   return res.status(401).json({ message: 'User not found in Firestore' });
      // }
      // req.user = userDoc.data(); // Now req.user has full user data
      next(); // Proceed to the next middleware or route handler
    } catch (error) {
      console.error('Token verification failed:', error);
      if (error.code === 'auth/id-token-expired') { // This error code might not be relevant anymore if not verifying Firebase ID token
          return res.status(401).json({ message: 'Token expired, please login again.' });
      }
      if (error.name === 'JsonWebTokenError') {
           return res.status(401).json({ message: 'Invalid token signature.' });
      }
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

module.exports = { protect };
