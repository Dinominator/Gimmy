// gimmy/backend/controllers/exerciseController.js
const { db } = require('../config/firebaseConfig');
const { FieldValue } = require('firebase-admin/firestore'); // For array operations or deleting fields

// Add a new exercise (Trainer only)
const addExercise = async (req, res) => {
  const { name, description, animationUrl } = req.body;
  const authorUid = req.user.uid; // From 'protect' middleware
  const authorName = req.user.name; // From 'protect' middleware (Firebase token)

  if (!name || !description) {
    return res.status(400).json({ message: 'Exercise name and description are required.' });
  }

  try {
    const userDoc = await db.collection('users').doc(authorUid).get();
    if (!userDoc.exists || userDoc.data().role !== 'trainer') {
      return res.status(403).json({ message: 'Forbidden: Only trainers can add exercises.' });
    }

    const newExercise = {
      name,
      description,
      authorUid,
      authorName: userDoc.data().name || authorName, // Prefer name from DB if available
      animationUrl: animationUrl || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const docRef = await db.collection('exercises').add(newExercise);
    res.status(201).json({ message: 'Exercise added successfully', id: docRef.id, ...newExercise });
  } catch (error) {
    console.error('Error adding exercise:', error);
    res.status(500).json({ message: 'Error adding exercise', error: error.message });
  }
};

// Get all exercises (Public)
const getAllExercises = async (req, res) => {
  try {
    const exercisesSnapshot = await db.collection('exercises').orderBy('createdAt', 'desc').get();
    const exercises = exercisesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(exercises);
  } catch (error) {
    console.error('Error getting exercises:', error);
    res.status(500).json({ message: 'Error getting exercises', error: error.message });
  }
};

// Get a single exercise by ID (Public)
const getExerciseById = async (req, res) => {
  const { exerciseId } = req.params;
  try {
    const exerciseDoc = await db.collection('exercises').doc(exerciseId).get();
    if (!exerciseDoc.exists) {
      return res.status(404).json({ message: 'Exercise not found' });
    }
    res.status(200).json({ id: exerciseDoc.id, ...exerciseDoc.data() });
    } catch (error) {
    console.error('Error getting exercise by ID:', error);
    res.status(500).json({ message: 'Error getting exercise', error: error.message });
  }
};

// Update an exercise (Trainer only, author of exercise)
const updateExercise = async (req, res) => {
  const { exerciseId } = req.params;
  const { name, description, animationUrl } = req.body;
  const authorUid = req.user.uid; // From 'protect' middleware

  if (!name && !description && animationUrl === undefined) {
      return res.status(400).json({ message: 'No update data provided (name, description, or animationUrl).' });
  }

  try {
    const userDoc = await db.collection('users').doc(authorUid).get();
    if (!userDoc.exists || userDoc.data().role !== 'trainer') {
      return res.status(403).json({ message: 'Forbidden: Only trainers can update exercises.' });
    }

    const exerciseRef = db.collection('exercises').doc(exerciseId);
    const exerciseDoc = await exerciseRef.get();

    if (!exerciseDoc.exists) {
      return res.status(404).json({ message: 'Exercise not found' });
    }

    if (exerciseDoc.data().authorUid !== authorUid) {
      return res.status(403).json({ message: 'Forbidden: You can only update your own exercises.' });
    }

    const updateData = {};
    if (name) updateData.name = name;
    if (description) updateData.description = description;
    if (animationUrl !== undefined) updateData.animationUrl = animationUrl; // Allow setting to null
    updateData.updatedAt = new Date().toISOString();

    await exerciseRef.update(updateData);
    res.status(200).json({ message: 'Exercise updated successfully', id: exerciseId, ...updateData });
  } catch (error) {
    console.error('Error updating exercise:', error);
    res.status(500).json({ message: 'Error updating exercise', error: error.message });
  }
};

// Delete an exercise (Trainer only, author of exercise)
const deleteExercise = async (req, res) => {
  const { exerciseId } = req.params;
  const authorUid = req.user.uid; // From 'protect' middleware

  try {
    const userDoc = await db.collection('users').doc(authorUid).get();
    if (!userDoc.exists || userDoc.data().role !== 'trainer') {
      return res.status(403).json({ message: 'Forbidden: Only trainers can delete exercises.' });
    }

    const exerciseRef = db.collection('exercises').doc(exerciseId);
    const exerciseDoc = await exerciseRef.get();

    if (!exerciseDoc.exists) {
      return res.status(404).json({ message: 'Exercise not found' });
    }

    if (exerciseDoc.data().authorUid !== authorUid) {
      return res.status(403).json({ message: 'Forbidden: You can only delete your own exercises.' });
    }

    await exerciseRef.delete();
    res.status(200).json({ message: 'Exercise deleted successfully' });
  } catch (error) {
    console.error('Error deleting exercise:', error);
    res.status(500).json({ message: 'Error deleting exercise', error: error.message });
  }
};

module.exports = {
  addExercise,
  getAllExercises,
  getExerciseById,
  updateExercise,
  deleteExercise,
};
