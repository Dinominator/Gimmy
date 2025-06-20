// gimmy/backend/routes/connectionRoutes.js
const express = require('express');
const {
  searchTrainees,
  sendConnectionRequest,
  getPendingRequests,
  respondToConnectionRequest,
  getConnectedTrainees,
  getTraineeProfile,
  removeTraineeByTrainer,
  leaveTrainerProgramByTrainee,
} = require('../controllers/connectionController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Trainer specific routes
router.get('/search-trainees', protect, searchTrainees); // Trainers search for trainees
router.post('/send-request', protect, sendConnectionRequest); // Trainers send request to trainee
router.get('/my-trainees', protect, getConnectedTrainees); // Trainers get their list of accepted trainees
router.delete('/remove-trainee/:connectionId', protect, removeTraineeByTrainer); // Trainer removes a trainee

// Trainee specific routes
router.get('/pending-requests', protect, getPendingRequests); // Trainees get their pending requests
router.post('/respond-request/:requestId', protect, respondToConnectionRequest); // Trainees accept/reject
router.delete('/leave-program/:connectionId', protect, leaveTrainerProgramByTrainee); // Trainee leaves a program

// Shared (but protected)
router.get('/trainee-profile/:traineeId', protect, getTraineeProfile); // View a trainee's profile (e.g. by trainer)

module.exports = router;
