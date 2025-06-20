// gimmy/backend/config/firebaseConfig.js
// Remember to replace with your actual Firebase Admin SDK setup
// and service account key.
const admin = require('firebase-admin');

// IMPORTANT: Create a serviceAccountKey.json file in the /config directory
// Download this from your Firebase project settings
// Ensure this file is added to .gitignore if it's not already covered by a broader rule
try {
  const serviceAccount = require('./serviceAccountKey.json'); // Placeholder

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
  console.log('Firebase Admin SDK initialized successfully.');
} catch (error) {
  console.error('Error initializing Firebase Admin SDK:', error);
  console.log('Please ensure you have a valid serviceAccountKey.json in the /config directory.');
  // process.exit(1); // Optionally exit if Firebase connection is critical
}

const db = admin.firestore();
const auth = admin.auth();

module.exports = { db, auth, admin };
