// src/pages/AllExercisesPage.jsx
import React, { useEffect, useState } from 'react';
import { getAllExercises } from '../services/exerciseService'; // Corrected path
import { Container, Grid, Typography, CircularProgress, Alert, Box } from '@mui/material';
import ExerciseCard from '../components/ExerciseCard';

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
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 200px)', p:3 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container sx={{ py: { xs: 2, sm: 4 } }} maxWidth="md">
        <Alert severity="error" variant="filled">{error}</Alert>
      </Container>
    );
  }

  if (exercises.length === 0) {
    return (
      <Container sx={{ py: { xs: 2, sm: 4 } }} maxWidth="md">
        <Typography variant="h6" align="center" color="text.secondary" sx={{p:2}}>
          No exercises found at the moment.
        </Typography>
      </Container>
    );
  }

  return (
    <Container sx={{ py: { xs: 2, sm: 4 } }} maxWidth="lg">
      <Typography variant="h1" component="h1" gutterBottom align="center" sx={{ mb: {xs:3, sm:5} }}>
        Exercise Library
      </Typography>
      <Grid container spacing={3}>
        {exercises.map((exercise) => (
          <Grid item key={exercise.id} xs={12} sm={6} md={4} lg={3}>
            <ExerciseCard exercise={exercise} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default AllExercisesPage;
