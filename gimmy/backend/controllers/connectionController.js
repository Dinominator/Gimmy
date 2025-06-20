// gimmy/backend/controllers/connectionController.js
const { db } = require('../config/firebaseConfig');
const { FieldValue } = require('firebase-admin/firestore');
const { createNotification } = require('./notificationController');
const { sendEmail } = require('../services/emailService');

// Search for trainees by name or email (Trainer only)
const searchTrainees = async (req, res) => {
  const { searchTerm } = req.query; // e.g., /api/connections/search-trainees?searchTerm=john
  const requesterUid = req.user.uid;

  if (!searchTerm) {
    return res.status(400).json({ message: 'Search term is required.' });
  }

  try {
    const requesterDoc = await db.collection('users').doc(requesterUid).get();
    if (!requesterDoc.exists || requesterDoc.data().role !== 'trainer') {
      return res.status(403).json({ message: 'Forbidden: Only trainers can search for trainees.' });
    }

    // Search by name (case-insensitive prefix)
    const nameQuery = db.collection('users')
      .where('role', '==', 'trainee')
      .where('name', '>=', searchTerm)
      .where('name', '<=', searchTerm + '\uf8ff') // '' is a high Unicode character for prefix matching
      .limit(10);

    // Search by email
    const emailQuery = db.collection('users')
      .where('role', '==', 'trainee')
      .where('email', '==', searchTerm)
      .limit(10);

    const [nameSnapshot, emailSnapshot] = await Promise.all([nameQuery.get(), emailQuery.get()]);

    const trainees = new Map(); // Use a Map to avoid duplicates if user matches both name and email
    nameSnapshot.docs.forEach(doc => trainees.set(doc.id, { id: doc.id, name: doc.data().name, email: doc.data().email, photoURL: doc.data().photoURL }));
    emailSnapshot.docs.forEach(doc => trainees.set(doc.id, { id: doc.id, name: doc.data().name, email: doc.data().email, photoURL: doc.data().photoURL }));

    res.status(200).json(Array.from(trainees.values()));
  } catch (error) {
    console.error('Error searching trainees:', error);
    res.status(500).json({ message: 'Error searching trainees', error: error.message });
  }
};

// Send a connection request from Trainer to Trainee
const sendConnectionRequest = async (req, res) => {
  const trainerUid = req.user.uid;
  const { traineeId } = req.body;

  if (!traineeId) {
    return res.status(400).json({ message: 'Trainee ID is required.' });
  }
  if (trainerUid === traineeId) {
    return res.status(400).json({ message: 'Cannot send a request to yourself.' });
  }

  try {
    const trainerDoc = await db.collection('users').doc(trainerUid).get();
    if (!trainerDoc.exists || trainerDoc.data().role !== 'trainer') {
      return res.status(403).json({ message: 'Forbidden: Only trainers can send requests.' });
    }

    const traineeDoc = await db.collection('users').doc(traineeId).get();
    if (!traineeDoc.exists || traineeDoc.data().role !== 'trainee') {
      return res.status(404).json({ message: 'Trainee not found or user is not a trainee.' });
    }

    // Check if a request already exists or they are already connected
    const existingConnectionQuery = db.collection('connections')
      .where('trainerId', '==', trainerUid)
      .where('traineeId', '==', traineeId)
      .limit(1);
    const existingConnectionSnapshot = await existingConnectionQuery.get();

    if (!existingConnectionSnapshot.empty) {
      const existingConnection = existingConnectionSnapshot.docs[0].data();
      if (existingConnection.status === 'accepted') {
          return res.status(400).json({ message: 'Already connected with this trainee.' });
      } else if (existingConnection.status === 'pending') {
          return res.status(400).json({ message: 'Connection request already pending.' });
      }
      // If rejected, allow sending a new request by creating a new doc or updating old one.
      // For simplicity, we'll create a new one, or you could update existing.
    }

    const requestData = {
      trainerId: trainerUid,
      trainerName: trainerDoc.data().name,
      traineeId,
      traineeName: traineeDoc.data().name,
      status: 'pending', // pending, accepted, rejected
      requestedAt: new Date().toISOString(),
      respondedAt: null,
    };

    const docRef = await db.collection('connections').add(requestData);
    // TODO: Implement notification to trainee (email or in-app)
    await createNotification(
      traineeId,
      'connection_request_received',
      `You have a new connection request from ${trainerDoc.data().name}.`,
      docRef.id // ID of the connection document
    );
    res.status(201).json({ message: 'Connection request sent.', id: docRef.id, ...requestData });
  } catch (error) {
    console.error('Error sending connection request:', error);
    res.status(500).json({ message: 'Error sending request', error: error.message });
  }
};

// Get pending requests for the logged-in trainee
const getPendingRequests = async (req, res) => {
  const traineeUid = req.user.uid;
  try {
    const userDoc = await db.collection('users').doc(traineeUid).get();
    if (!userDoc.exists || userDoc.data().role !== 'trainee') {
      return res.status(403).json({ message: 'Forbidden: Only trainees can view their requests.' });
    }

    const requestsSnapshot = await db.collection('connections')
      .where('traineeId', '==', traineeUid)
      .where('status', '==', 'pending')
      .orderBy('requestedAt', 'desc')
      .get();

    const requests = requestsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(requests);
  } catch (error) {
    console.error('Error fetching pending requests:', error);
    res.status(500).json({ message: 'Error fetching requests', error: error.message });
  }
};

// Respond to a connection request (Accept/Reject) - Trainee only
const respondToConnectionRequest = async (req, res) => {
  const traineeUid = req.user.uid;
  const { requestId } = req.params;
  const { response } = req.body; // 'accept' or 'reject'

  if (!response || !['accepted', 'rejected'].includes(response)) {
    return res.status(400).json({ message: 'Invalid response. Must be "accepted" or "rejected".' });
  }

  try {
    const userDoc = await db.collection('users').doc(traineeUid).get();
    if (!userDoc.exists || userDoc.data().role !== 'trainee') {
      return res.status(403).json({ message: 'Forbidden: Only trainees can respond to requests.' });
    }

    const requestRef = db.collection('connections').doc(requestId);
    const requestDoc = await requestRef.get();

    if (!requestDoc.exists || requestDoc.data().traineeId !== traineeUid || requestDoc.data().status !== 'pending') {
      return res.status(404).json({ message: 'Pending request not found or not authorized to respond.' });
    }

    await requestRef.update({
      status: response,
      respondedAt: new Date().toISOString(),
    });

    // TODO: Implement notification to trainer (email or in-app) if accepted
      const connectionData = requestDoc.data();
      if (response === 'accepted') {
        await createNotification(
          connectionData.trainerId,
          'request_accepted',
          `${connectionData.traineeName} accepted your connection request.`,
          traineeUid // ID of the trainee who accepted
        );
        const trainerProfile = await db.collection('users').doc(connectionData.trainerId).get();
        if (sendEmail && trainerProfile.exists) {
          await sendEmail(
            trainerProfile.data().email,
            'Connection Request Accepted on Gimmy',
            `<h1>Request Accepted!</h1><p>${connectionData.traineeName} (ID: ${traineeUid}) has accepted your connection request on Gimmy.</p>`,
            `${connectionData.traineeName} (ID: ${traineeUid}) has accepted your connection request on Gimmy.`
          ).catch(err => console.error("Failed to send request accepted email:", err));
        }
      }
      // Optional: Notify for rejection as well
      // else if (response === 'rejected') {
      //   await createNotification(
      //     connectionData.trainerId,
      //     'request_rejected',
      //     `${connectionData.traineeName} rejected your connection request.`,
      //     traineeUid
      //   );
      // }
    res.status(200).json({ message: `Request ${response}.` });
  } catch (error) {
    console.error('Error responding to request:', error);
    res.status(500).json({ message: 'Error responding to request', error: error.message });
  }
};

// Get list of connected trainees for a trainer
const getConnectedTrainees = async (req, res) => {
  const trainerUid = req.user.uid;
  try {
    const userDoc = await db.collection('users').doc(trainerUid).get();
    if (!userDoc.exists || userDoc.data().role !== 'trainer') {
      return res.status(403).json({ message: 'Forbidden: Only trainers can view their trainees.' });
    }

    const connectionsSnapshot = await db.collection('connections')
      .where('trainerId', '==', trainerUid)
      .where('status', '==', 'accepted')
      .get();

    if (connectionsSnapshot.empty) {
      return res.status(200).json([]);
    }

    const traineeIds = connectionsSnapshot.docs.map(doc => doc.data().traineeId);
    // Fetch details for these trainees
    const traineeDetailsPromises = traineeIds.map(id => db.collection('users').doc(id).get());
    const traineeDetailsDocs = await Promise.all(traineeDetailsPromises);

    const trainees = traineeDetailsDocs
      .filter(doc => doc.exists)
      .map(doc => ({
          id: doc.id, // trainee's user ID
          name: doc.data().name,
          email: doc.data().email,
          photoURL: doc.data().photoURL,
          age: doc.data().age,
          trainingGoal: doc.data().trainingGoal,
          // You might want to include the connectionId if frontend needs it for e.g. removal
          connectionId: connectionsSnapshot.docs.find(connDoc => connDoc.data().traineeId === doc.id).id
      }));

    res.status(200).json(trainees);
  } catch (error) {
    console.error('Error fetching connected trainees:', error);
    res.status(500).json({ message: 'Error fetching trainees', error: error.message });
  }
};

// Get a specific trainee's public profile (for trainer to view)
const getTraineeProfile = async (req, res) => {
  const { traineeId } = req.params;
  // const requesterUid = req.user.uid; // Requester could be trainer or trainee (if trainee views own)

  try {
      // Optional: Add check if requester is connected to this trainee if profile is not fully public
      const traineeDoc = await db.collection('users').doc(traineeId).get();
      if (!traineeDoc.exists || traineeDoc.data().role !== 'trainee') {
          return res.status(404).json({ message: 'Trainee profile not found.' });
      }
      const { uid, name, email, photoURL, age, trainingGoal, role } = traineeDoc.data();
      // Only return public-safe information
      res.status(200).json({ uid, name, email, photoURL, age, trainingGoal, role });
  } catch (error) {
      console.error('Error fetching trainee profile:', error);
      res.status(500).json({ message: 'Error fetching profile', error: error.message });
  }
};

// Trainer removes a trainee from their program (deletes the connection)
const removeTraineeByTrainer = async (req, res) => {
  const trainerUid = req.user.uid;
  const { connectionId } = req.params; // ID of the connection document

  try {
      const trainerDoc = await db.collection('users').doc(trainerUid).get();
      if (!trainerDoc.exists || trainerDoc.data().role !== 'trainer') {
          return res.status(403).json({ message: 'Forbidden: Only trainers can remove trainees.' });
      }

      const connectionRef = db.collection('connections').doc(connectionId);
      const connectionDoc = await connectionRef.get();

      if (!connectionDoc.exists || connectionDoc.data().trainerId !== trainerUid || connectionDoc.data().status !== 'accepted') {
          return res.status(404).json({ message: 'Accepted connection not found or not authorized.' });
      }

      await connectionRef.delete();
      // TODO: Notify trainee (optional)
      res.status(200).json({ message: 'Trainee removed from program successfully.' });
  } catch (error) {
      console.error('Error removing trainee:', error);
      res.status(500).json({ message: 'Error removing trainee', error: error.message });
  }
};

// Trainee leaves a trainer's program (deletes the connection)
const leaveTrainerProgramByTrainee = async (req, res) => {
  const traineeUid = req.user.uid;
  const { connectionId } = req.params; // ID of the connection document

  try {
      const traineeDoc = await db.collection('users').doc(traineeUid).get();
      if (!traineeDoc.exists || traineeDoc.data().role !== 'trainee') {
          return res.status(403).json({ message: 'Forbidden: Only trainees can leave programs.' });
      }

      const connectionRef = db.collection('connections').doc(connectionId);
      const connectionDoc = await connectionRef.get();

      if (!connectionDoc.exists || connectionDoc.data().traineeId !== traineeUid || connectionDoc.data().status !== 'accepted') {
          return res.status(404).json({ message: 'Accepted connection not found or not authorized.' });
      }

      await connectionRef.delete();
      // TODO: Notify trainer (optional)
      res.status(200).json({ message: 'Successfully left trainer\'s program.' });
  } catch (error) {
      console.error('Error leaving program:', error);
      res.status(500).json({ message: 'Error leaving program', error: error.message });
  }
};


module.exports = {
  searchTrainees,
  sendConnectionRequest,
  getPendingRequests,
  respondToConnectionRequest,
  getConnectedTrainees,
  getTraineeProfile,
  removeTraineeByTrainer,
  leaveTrainerProgramByTrainee,
};
