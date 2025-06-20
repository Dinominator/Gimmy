// gimmy/backend/index.js
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const { db, auth } = require('./config/firebaseConfig');

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
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
