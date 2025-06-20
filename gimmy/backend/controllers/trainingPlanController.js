// gimmy/backend/controllers/trainingPlanController.js
const { db } = require('../config/firebaseConfig');
const { FieldValue } = require('firebase-admin/firestore');
const { createNotification } = require('./notificationController');
const { sendEmail } = require('../services/emailService');

// Helper function to check if trainer is connected to trainee
const isConnected = async (trainerId, traineeId) => {
  const connection = await db.collection('connections')
    .where('trainerId', '==', trainerId)
    .where('traineeId', '==', traineeId)
    .where('status', '==', 'accepted')
    .limit(1)
    .get();
  return !connection.empty;
};

// Create or update a weekly training plan for a trainee (Trainer only)
const upsertWeeklyPlan = async (req, res) => {
  const trainerUid = req.user.uid;
  const { traineeId, weekStartDate, dailySessions } = req.body; // weekStartDate (YYYY-MM-DD, ideally a Monday)
                                                              // dailySessions: { monday: [{exerciseId, sets, reps, notes}, ...], tuesday: [...] }

  if (!traineeId || !weekStartDate || !dailySessions) {
    return res.status(400).json({ message: 'Trainee ID, week start date, and daily sessions are required.' });
  }

  try {
    const trainerDoc = await db.collection('users').doc(trainerUid).get();
    if (!trainerDoc.exists || trainerDoc.data().role !== 'trainer') {
      return res.status(403).json({ message: 'Forbidden: Only trainers can create/update plans.' });
    }

    if (!(await isConnected(trainerUid, traineeId))) {
      return res.status(403).json({ message: 'Forbidden: You are not connected with this trainee.' });
    }

    // Validate dailySessions structure and fetch exercise names
    const enrichedDailySessions = {};
    for (const day in dailySessions) {
      if (Array.isArray(dailySessions[day])) {
          enrichedDailySessions[day] = [];
          for (const sessionExercise of dailySessions[day]) {
              if (!sessionExercise.exerciseId || !sessionExercise.sets || !sessionExercise.reps) {
                  return res.status(400).json({ message: `Exercise ID, sets, and reps are required for all exercises in ${day}.`});
              }
              const exerciseDoc = await db.collection('exercises').doc(sessionExercise.exerciseId).get();
              if (!exerciseDoc.exists) {
                  return res.status(400).json({ message: `Exercise with ID ${sessionExercise.exerciseId} not found.`});
              }
              enrichedDailySessions[day].push({
                  ...sessionExercise,
                  exerciseName: exerciseDoc.data().name, // Add exercise name for convenience
                  completed: sessionExercise.completed || false, // Default to not completed
              });
          }
      } else {
          enrichedDailySessions[day] = []; // Ensure day exists even if empty
      }
    }


    // Use traineeId and weekStartDate as a composite key for the plan if desired, or generate unique ID
    // For simplicity, we query for an existing plan for that week.
    const planQuery = db.collection('trainingPlans')
      .where('traineeId', '==', traineeId)
      .where('weekStartDate', '==', weekStartDate)
      .limit(1);

    const planSnapshot = await planQuery.get();

    const planData = {
      trainerId: trainerUid,
      traineeId,
      weekStartDate, // Store as ISO string or Firestore Timestamp
      dailySessions: enrichedDailySessions, // Contains exerciseId, exerciseName, sets, reps, notes, completed status
      status: 'active', // or 'upcoming' based on date logic
      updatedAt: new Date().toISOString(),
    };

    let planId;
    if (planSnapshot.empty) {
      planData.createdAt = new Date().toISOString();
      const docRef = await db.collection('trainingPlans').add(planData);
      planId = docRef.id;
      // TODO: Notify trainee about new plan (email or in-app)
      await createNotification(
        traineeId,
        'plan_assigned',
        `Your trainer has assigned you a new training plan for the week starting ${weekStartDate}.`,
        docRef.id // ID of the new plan
      );
        const traineeProfile = await db.collection('users').doc(traineeId).get();
        if (sendEmail && traineeProfile.exists) {
          const emailSubject = 'New Training Plan Assigned on Gimmy';
          const emailHtml = `<h1>New Training Plan!</h1><p>Your trainer has assigned you a new training plan for the week starting ${weekStartDate}. Log in to Gimmy to view it.</p>`;
          const emailText = `Your trainer has assigned you a new training plan for the week starting ${weekStartDate}. Log in to Gimmy to view it.`;
          await sendEmail(
            traineeProfile.data().email,
            emailSubject,
            emailHtml,
            emailText
          ).catch(err => console.error("Failed to send training plan email:", err));
        }
    } else {
      planId = planSnapshot.docs[0].id;
      await db.collection('trainingPlans').doc(planId).update(planData);
       // TODO: Notify trainee about updated plan (email or in-app)
      await createNotification(
        traineeId,
        'plan_updated', // Potentially a different type or same as 'plan_assigned'
        `Your training plan for the week starting ${weekStartDate} has been updated.`,
        planId // ID of the updated plan
      );
      const traineeProfile = await db.collection('users').doc(traineeId).get();
      if (sendEmail && traineeProfile.exists) {
        const emailSubject = 'Your Training Plan Updated on Gimmy';
        const emailHtml = `<h1>Plan Updated!</h1><p>Your training plan for the week starting ${weekStartDate} has been updated. Log in to Gimmy to check the changes.</p>`;
        const emailText = `Your training plan for the week starting ${weekStartDate} has been updated. Log in to Gimmy to check the changes.`;
        await sendEmail(
          traineeProfile.data().email,
          emailSubject,
          emailHtml,
          emailText
        ).catch(err => console.error("Failed to send training plan email:", err));
      }
    }

    res.status(201).json({ message: 'Weekly plan saved successfully.', planId, ...planData });
  } catch (error) {
    console.error('Error saving weekly plan:', error);
    res.status(500).json({ message: 'Error saving plan', error: error.message });
  }
};

// Get a trainee's weekly plan (Trainee: their own, Trainer: their connected trainee's)
const getWeeklyPlan = async (req, res) => {
  const requesterUid = req.user.uid;
  const { traineeId, weekStartDate } = req.query; // YYYY-MM-DD

  if (!traineeId || !weekStartDate) {
    return res.status(400).json({ message: 'Trainee ID and week start date are required.' });
  }

  try {
    const requesterDoc = await db.collection('users').doc(requesterUid).get();
    if (!requesterDoc.exists) return res.status(403).json({ message: 'User not found.' });

    const requesterRole = requesterDoc.data().role;

    if (requesterRole === 'trainee' && requesterUid !== traineeId) {
      return res.status(403).json({ message: 'Forbidden: Trainees can only view their own plans.' });
    }
    if (requesterRole === 'trainer' && !(await isConnected(requesterUid, traineeId))) {
       return res.status(403).json({ message: 'Forbidden: Trainers can only view plans of connected trainees.' });
    }

    const planSnapshot = await db.collection('trainingPlans')
      .where('traineeId', '==', traineeId)
      .where('weekStartDate', '==', weekStartDate)
      .limit(1)
      .get();

    if (planSnapshot.empty) {
      return res.status(404).json({ message: 'Training plan not found for this week.' });
    }

    const plan = { id: planSnapshot.docs[0].id, ...planSnapshot.docs[0].data() };
    res.status(200).json(plan);
  } catch (error) {
    console.error('Error getting weekly plan:', error);
    res.status(500).json({ message: 'Error getting plan', error: error.message });
  }
};

// Get all plans for a trainee (e.g. for history view)
const getAllPlansForTrainee = async (req, res) => {
  const requesterUid = req.user.uid;
  const { traineeId } = req.params;

  try {
      const requesterDoc = await db.collection('users').doc(requesterUid).get();
      if (!requesterDoc.exists) return res.status(403).json({ message: 'User not found.' });
      const requesterRole = requesterDoc.data().role;

      if (requesterRole === 'trainee' && requesterUid !== traineeId) {
          return res.status(403).json({ message: 'Forbidden: Trainees can only view their own plans.' });
      }
      if (requesterRole === 'trainer' && !(await isConnected(requesterUid, traineeId))) {
          return res.status(403).json({ message: 'Forbidden: Trainers can only view plans of connected trainees.' });
      }

      const plansSnapshot = await db.collection('trainingPlans')
          .where('traineeId', '==', traineeId)
          .orderBy('weekStartDate', 'desc')
          .get();

      const plans = plansSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      res.status(200).json(plans);

  } catch (error) {
      console.error('Error getting all plans for trainee:', error);
      res.status(500).json({ message: 'Error getting plans', error: error.message });
  }
};


// Trainee updates completion status of an exercise in a session (Trainee only)
const updateExerciseCompletion = async (req, res) => {
  const traineeUid = req.user.uid;
  // planId, day (e.g. "monday"), exerciseId (the one within the plan's session), completed (boolean)
  const { planId, day, exerciseEntryId, completed } = req.body;
  // Note: exerciseEntryId could be the exerciseId if unique per day, or an index, or a generated unique ID for that entry.
  // For simplicity, let's assume exerciseId is what we match, and it's unique enough within a day's plan.
  // A more robust way is to assign unique IDs to each exercise entry when plan is created.
  // For now, we'll find by exerciseId and update the first match in that day.

  if (!planId || !day || !exerciseEntryId || typeof completed !== 'boolean') {
    return res.status(400).json({ message: 'Plan ID, day, exercise ID, and completion status are required.' });
  }

  try {
    const traineeDoc = await db.collection('users').doc(traineeUid).get();
    if (!traineeDoc.exists || traineeDoc.data().role !== 'trainee') {
      return res.status(403).json({ message: 'Forbidden: Only trainees can update completion.' });
    }

    const planRef = db.collection('trainingPlans').doc(planId);
    const planDoc = await planRef.get();

    if (!planDoc.exists || planDoc.data().traineeId !== traineeUid) {
      return res.status(404).json({ message: 'Training plan not found or not authorized.' });
    }

    const planData = planDoc.data();
    if (!planData.dailySessions || !planData.dailySessions[day]) {
      return res.status(404).json({ message: `No sessions found for ${day} in this plan.` });
    }

    // Find the exercise in the array and update its completed status
    // This is tricky with Firestore without unique IDs for each exercise *instance*.
    // We'll update the whole day's session array.
    let exerciseUpdated = false;
    const updatedDaySessions = planData.dailySessions[day].map(ex => {
        // Assuming exerciseEntryId is the original exerciseId stored in the plan
        if (ex.exerciseId === exerciseEntryId && !exerciseUpdated) {
            exerciseUpdated = true; // Mark that we found and are updating one.
            return { ...ex, completed };
        }
        return ex;
    });

    if (!exerciseUpdated) {
        return res.status(404).json({ message: `Exercise with ID ${exerciseEntryId} not found in ${day}'s plan.` });
    }

    await planRef.update({
      [`dailySessions.${day}`]: updatedDaySessions,
      updatedAt: new Date().toISOString(),
    });

    // TODO: Notify trainer about completion update (e.g. if whole session is done)
    // Check if all exercises for the day are complete to send a "session_completed" notification
    const updatedPlanData = (await planRef.get()).data();
    const daySession = updatedPlanData.dailySessions[day];
    const allDayExercisesCompleted = daySession && daySession.every(ex => ex.completed);

    if (allDayExercisesCompleted && daySession.length > 0) {
      await createNotification(
        updatedPlanData.trainerId,
        'session_completed',
        `${traineeDoc.data().name} has completed all exercises for ${day} in the plan for week ${updatedPlanData.weekStartDate}.`,
        planId
      );
    }
    res.status(200).json({ message: 'Exercise completion status updated.' });
  } catch (error) {
    console.error('Error updating exercise completion:', error);
    res.status(500).json({ message: 'Error updating completion', error: error.message });
  }
};

// Trainer views completion status for a trainee's week (Trainer only)
// This is largely covered by getWeeklyPlan, but could be a more summarized view.
// For now, getWeeklyPlan will contain the completion flags.

module.exports = {
  upsertWeeklyPlan,
  getWeeklyPlan,
  getAllPlansForTrainee,
  updateExerciseCompletion,
};
