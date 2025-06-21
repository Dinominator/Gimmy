// gimmy/backend/controllers/authController.js
const { auth, db } = require('../config/firebaseConfig'); // Firebase admin instance
const jwt = require('jsonwebtoken');
const { sendEmail } = require('../services/emailService');

// Helper function to generate JWT
const generateToken = (uid) => {
  return jwt.sign({ uid }, process.env.JWT_SECRET, {
    expiresIn: '30d', // Expires in 30 days
  });
};

// Register a new user with email and password
const registerUser = async (req, res) => {
  const { email, password, name, role } = req.body; // role can be 'trainer' or 'trainee'

  // Log the received body for debugging
  console.log('Attempting to register user. Received body:', { email: req.body.email, name: req.body.name, role: req.body.role, passwordProvided: !!req.body.password });


  if (!email || !password || !name || !role) {
    return res.status(400).json({ message: 'Please provide email, password, name, and role (trainer/trainee)' });
  }

  try {
    const userRecord = await auth.createUser({
      email,
      password,
      displayName: name,
    });

    // Store additional user info in Firestore
    await db.collection('users').doc(userRecord.uid).set({
      uid: userRecord.uid,
      email,
      name,
      role, // 'trainer' or 'trainee'
      photoURL: null, // Can be updated later
      age: null,
      trainingGoal: null,
      createdAt: new Date().toISOString(),
    });

    // Set custom claim for role-based access if needed (optional)
    // await auth.setCustomUserClaims(userRecord.uid, { role });

    // Log successful registration attempt before sending email for easier debugging
    console.log(`User registration initiated for email: ${email}, role: ${role}, name: ${name}`);

    const token = generateToken(userRecord.uid);

    res.status(201).json({
      message: 'User registered successfully',
      uid: userRecord.uid,
      email: userRecord.email,
      name: userRecord.displayName,
      role,
      token,
    });

      if (sendEmail) { // Check if email service is available
        await sendEmail(
          email,
          'Welcome to Gimmy!',
          `<h1>Welcome, ${name}!</h1><p>Thank you for registering with Gimmy. Get ready to achieve your fitness goals!</p><p>Your role: ${role}</p>`,
          `Welcome, ${name}! Thank you for registering with Gimmy. Your role: ${role}`
        ).catch(err => console.error("Failed to send welcome email:", err)); // Catch specific email error
      }
  } catch (error) {
    console.error(`Error registering user [${email}]:`, error.message);
    console.error("Full error object:", JSON.stringify(error, Object.getOwnPropertyNames(error), 2));
    // Avoid logging req.body directly if it contains raw password, but log parts of it if safe.
    console.error("Request body (structure check - name, email, role):", { name: req.body.name, email: req.body.email, role: req.body.role });
    // Provide more specific error messages based on Firebase error codes
    if (error.code === 'auth/email-already-exists') {
      return res.status(400).json({ message: 'Email already in use.' });
    }
    if (error.code === 'auth/invalid-password') {
      return res.status(400).json({ message: 'Password must be at least 6 characters long.' });
    }
    res.status(500).json({ message: 'Error registering user', error: error.message });
  }
};

// Login user with email and password
const loginUser = async (req, res) => {
  const { email, password, attemptTrainerLogin } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Please provide email and password' });
  }
  try {
    // Firebase Admin SDK does not directly handle password verification for login.
    // Client SDK handles this. For backend, we'd typically verify an ID token sent from client.
    // However, for a direct backend login (e.g. for testing or specific flows),
    // this is a common pattern, but it requires client to send password.
    // A more secure flow is for client to sign in with Firebase client SDK, get ID token, send to backend.
    // Then backend verifies ID token using auth.verifyIdToken(idTokenFromClient).

    // This example assumes a scenario where client sends email/password directly.
    // This is LESS SECURE than client-side Firebase Auth + ID token verification.
    // For now, we'll simulate by trying to get the user by email to check existence.
    // Actual password check is done by Firebase on client side.

    const userRecord = await auth.getUserByEmail(email);
    // NOTE: We cannot verify password directly here using Firebase Admin SDK.
    // The client should use Firebase Client SDK to sign in, then send the ID token to the backend.
    // The backend then verifies this ID token.

    // For this example, if getUserEmail is successful, we assume client handled password.
    // In a real app, the client would send an ID token after successful Firebase client-side login.

    const userDoc = await db.collection('users').doc(userRecord.uid).get();
    if (!userDoc.exists) {
        return res.status(404).json({ message: 'User data not found in Firestore.' });
    }
    const userData = userDoc.data();

    if (attemptTrainerLogin && userData.role !== 'trainer') {
      // User explicitly tried to log in as a trainer, but their role is not 'trainer'.
      return res.status(403).json({ message: 'Access Denied. You do not have trainer privileges.' });
    }

    const token = generateToken(userRecord.uid);

    res.status(200).json({
      message: 'User logged in successfully (simulation - client should handle actual login)',
      uid: userRecord.uid,
      email: userRecord.email,
      name: userData.name,
      role: userData.role,
      photoURL: userData.photoURL,
      token,
    });
  } catch (error) {
    console.error('Error logging in user:', error);
    if (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential') {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    res.status(500).json({ message: 'Error logging in user', error: error.message });
  }
};

// Login/Register with Google (expects ID token from client)
const googleLogin = async (req, res) => {
  const { idToken } = req.body;

  if (!idToken) {
      return res.status(400).json({ message: 'ID token from Google is required.' });
  }

  try {
      const decodedToken = await auth.verifyIdToken(idToken);
      const uid = decodedToken.uid;
      let user = await db.collection('users').doc(uid).get();

      let token = generateToken(uid); // Generate our app's JWT

      if (!user.exists) {
          // New user via Google
          const newUser = {
              uid,
              email: decodedToken.email,
              name: decodedToken.name,
              photoURL: decodedToken.picture || null,
              role: req.body.role || 'trainee', // Default to trainee, client might specify during first Google Sign-In
              age: null,
              trainingGoal: null,
              createdAt: new Date().toISOString(),
          };
          await db.collection('users').doc(uid).set(newUser);
          // await auth.setCustomUserClaims(uid, { role: newUser.role }); // Optional

          return res.status(201).json({
              message: 'User registered and logged in with Google successfully.',
              ...newUser,
              token,
          });
      } else {
          // Existing user
          const userData = user.data();
          return res.status(200).json({
              message: 'User logged in with Google successfully.',
              ...userData,
              token,
          });
      }
  } catch (error) {
      console.error('Error with Google login:', error);
      if (error.code === 'auth/id-token-revoked' || error.code === 'auth/id-token-expired') {
          return res.status(401).json({ message: 'Google ID token is invalid or expired.' });
      }
      res.status(500).json({ message: 'Error with Google login', error: error.message });
  }
};


// Get current user profile (protected route)
const getUserProfile = async (req, res) => {
  // req.user is populated by the 'protect' middleware with Firebase decoded token
  const uid = req.user.uid;
  try {
    const userDoc = await db.collection('users').doc(uid).get();
    if (!userDoc.exists) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(userDoc.data());
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: 'Error fetching user profile', error: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  googleLogin,
  getUserProfile,
};
