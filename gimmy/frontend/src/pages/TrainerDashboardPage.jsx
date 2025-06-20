// src/pages/TrainerDashboardPage.jsx
import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getAllExercises, addExercise, updateExercise as updateExerciseService, deleteExercise as deleteExerciseService } from '../services/exerciseService';
import ExerciseCard from '../components/ExerciseCard'; // Assuming refactor
import AddExerciseModal from '../components/AddExerciseModal';
import { Container, Typography, Grid, Button, CircularProgress, Alert, Fab } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { Box } from '@mui/system';

const TrainerDashboardPage = () => {
  const { user } = useAuth();
  const [myExercises, setMyExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingExercise, setEditingExercise] = useState(null); // For edit mode

  const fetchTrainerExercises = async () => {
    if (!user) return;
    setLoading(true);
    setError('');
    try {
      const allExercises = await getAllExercises(); // Fetch all
      // Filter by authorUid on the client-side. Ideally, backend provides an endpoint for this.
      setMyExercises(allExercises.filter(ex => ex.authorUid === user.uid));
    } catch (err) {
      setError(err.message || 'Failed to fetch exercises.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrainerExercises();
  }, [user]);

  const handleOpenModal = (exercise = null) => {
    setEditingExercise(exercise); // If exercise is passed, it's edit mode
    setModalOpen(true);
  };
  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingExercise(null); // Clear editing state
  };

  const handleAddOrUpdateExercise = async (exerciseData, exerciseId = null) => {
    // This function is passed to the modal
    try {
      if (exerciseId) { // Update existing exercise
        await updateExerciseService(exerciseId, exerciseData);
      } else { // Add new exercise
        await addExercise(exerciseData);
      }
      fetchTrainerExercises(); // Refresh list
      // No need to call handleCloseModal here, modal calls it on its own success
    } catch (err) {
      // Error will be displayed in the modal by the modal itself
      console.error("Failed to save exercise from dashboard:", err);
      throw err; // Re-throw to let modal handle its error state
    }
  };

  const handleDeleteExercise = async (exerciseId) => {
      if (window.confirm('Are you sure you want to delete this exercise?')) {
          setLoading(true); // Indicate loading for delete action
          try {
              await deleteExerciseService(exerciseId);
              fetchTrainerExercises(); // Refresh list
          } catch (err) {
              setError(err.message || 'Failed to delete exercise.');
              setLoading(false); // Reset loading on error
          }
          // setLoading(false) will be handled by fetchTrainerExercises's finally block on success
      }
  };


  if (loading && myExercises.length === 0) { // Show main loader only if no data yet
    return <Container sx={{ py: 4, display: 'flex', justifyContent: 'center' }}><CircularProgress /></Container>;
  }

  return (
    <Container sx={{ py: 4 }} maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom>
        Trainer Dashboard - My Exercises
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Box sx={{ mb: 2 }}>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenModal()}>
          Add New Exercise
        </Button>
      </Box>

      {myExercises.length === 0 && !loading && (
        <Typography variant="subtitle1">You haven't added any exercises yet.</Typography>
      )}

      {loading && myExercises.length > 0 && <CircularProgress sx={{display: 'block', margin: 'auto', my: 2}}/> }


      <Grid container spacing={3}>
        {myExercises.map((exercise) => (
          <Grid item key={exercise.id} xs={12} sm={6} md={4}>
            <ExerciseCard
              exercise={exercise}
              showActions={true}
              onEdit={() => handleOpenModal(exercise)}
              onDelete={handleDeleteExercise}
            />
          </Grid>
        ))}
      </Grid>

      <AddExerciseModal
        open={modalOpen}
        handleClose={handleCloseModal}
        onExerciseAdded={handleAddOrUpdateExercise}
        existingExercise={editingExercise}
      />

      {/* Floating Action Button for Add Exercise - Alternative UI */}
      {/* <Fab color="primary" aria-label="add" sx={{ position: 'fixed', bottom: 16, right: 16 }} onClick={() => handleOpenModal()}>
        <AddIcon />
      </Fab> */}
    </Container>
  );
};

export default TrainerDashboardPage;
