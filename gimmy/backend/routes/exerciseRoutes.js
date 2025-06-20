// gimmy/backend/routes/exerciseRoutes.js
const express = require('express');
const {
  addExercise,
  getAllExercises,
  getExerciseById,
  updateExercise,
  deleteExercise,
} = require('../controllers/exerciseController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Public routes
router.get('/', getAllExercises); // Get all exercises
router.get('/:exerciseId', getExerciseById); // Get a single exercise by ID

// Protected routes (Trainer specific for modifications)
router.post('/', protect, addExercise); // Add a new exercise
router.put('/:exerciseId', protect, updateExercise); // Update an exercise
router.delete('/:exerciseId', protect, deleteExercise); // Delete an exercise

module.exports = router;
