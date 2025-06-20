// gimmy/backend/routes/trainingPlanRoutes.js
const express = require('express');
const {
  upsertWeeklyPlan,
  getWeeklyPlan,
  getAllPlansForTrainee,
  updateExerciseCompletion,
} = require('../controllers/trainingPlanController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Trainer routes
router.post('/', protect, upsertWeeklyPlan); // Create/update a weekly plan for a trainee

// Shared routes (Trainer and Trainee, with controller-level checks)
router.get('/', protect, getWeeklyPlan); // Get specific weekly plan (query: traineeId, weekStartDate)
router.get('/all/:traineeId', protect, getAllPlansForTrainee); // Get all plans for a trainee

// Trainee routes
router.patch('/exercise-completion', protect, updateExerciseCompletion); // Trainee marks exercise as complete/incomplete

module.exports = router;
