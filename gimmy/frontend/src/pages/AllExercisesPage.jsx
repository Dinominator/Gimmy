// src/pages/AllExercisesPage.jsx
import React, { useEffect, useState } from 'react';
import { getAllExercises } from '../services/exerciseService';
import { Container, Grid, Typography, CircularProgress, Alert, Box } from '@mui/material';
// import { Link as RouterLink } from 'react-router-dom'; // For linking to a detailed page later
import ExerciseCard from '../components/ExerciseCard'; // Import the refactored component

const AllExercisesPage = () => {
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        setLoading(true);
        setError('');
        const data = await getAllExercises();
        setExercises(data);
      } catch (err) {
        setError(err.message || 'Failed to fetch exercises. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchExercises();
  }, []);

  if (loading) {
    return (
      <Container sx={{ py: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (exercises.length === 0) {
    return (
      <Container sx={{ py: 4 }}>
        <Typography variant="h6" align="center">No exercises found.</Typography>
      </Container>
    );
  }

  return (
    <Container sx={{ py: 4 }} maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom align="center">
        All Exercises
      </Typography>
      <Grid container spacing={3}>
        {exercises.map((exercise) => (
          <Grid item key={exercise.id} xs={12} sm={6} md={4}>
            <ExerciseCard exercise={exercise} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default AllExercisesPage;
