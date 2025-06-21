// gimmy/backend/index.js
const dotenv = require('dotenv');
dotenv.config(); // Ensure this is at the very top

const express = require('express');
const cors = require('cors');
const { db, auth } = require('./config/firebaseConfig');

const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173"; // Default for Vite dev

const app = express();
const port = process.env.PORT || 5001; // Changed fallback port to 5001

  // More specific CORS configuration
  app.use(cors({
    origin: FRONTEND_URL, // Allow only your frontend to connect
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'], // Specify allowed methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Specify allowed headers
    credentials: true // If you need to handle cookies or authorization headers from client
  }));

app.use(express.json());

app.get('/', (req, res) => {
  if (db) {
    res.send('Gimmy Backend API is running! Firebase Admin SDK seems initialized.');
  } else {
    res.send('Gimmy Backend API is running! Firebase Admin SDK NOT initialized. Check gimmy/backend/config/serviceAccountKey.json and logs.');
  }
  });

// Auth routes
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

// Exercise routes
const exerciseRoutes = require('./routes/exerciseRoutes');
app.use('/api/exercises', exerciseRoutes);

// Connection routes
const connectionRoutes = require('./routes/connectionRoutes');
app.use('/api/connections', connectionRoutes);

// Training Plan routes
const trainingPlanRoutes = require('./routes/trainingPlanRoutes');
app.use('/api/plans', trainingPlanRoutes);

// Notification routes
const notificationRoutes = require('./routes/notificationRoutes');
app.use('/api/notifications', notificationRoutes);

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
  if (db) {
    console.log('Firestore available (implies Firebase Admin SDK initialized).');
  } else {
    console.error('Firestore NOT available. Firebase Admin SDK may not have initialized correctly. Check your serviceAccountKey.json in gimmy/backend/config.');
  }
});
