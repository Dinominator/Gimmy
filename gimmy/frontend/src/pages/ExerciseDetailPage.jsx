// src/pages/ExerciseDetailPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import { getExerciseById } from '../services/exerciseService';
import { Container, Typography, CircularProgress, Alert, Box, Paper, Button, CardMedia, Link } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const ExerciseDetailPage = () => {
  const { exerciseId } = useParams();
  const [exercise, setExercise] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchExerciseDetails = async () => {
      try {
        setLoading(true);
        setError('');
        const data = await getExerciseById(exerciseId);
        setExercise(data);
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Failed to fetch exercise details.');
      } finally {
        setLoading(false);
      }
    };

    if (exerciseId) {
      fetchExerciseDetails();
    }
  }, [exerciseId]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 200px)', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container sx={{ py: { xs: 2, sm: 4 } }} maxWidth="md">
        <Alert severity="error" variant="filled">{error}</Alert>
        <Button
          component={RouterLink}
          to="/exercises"
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          sx={{ mt: 2 }}
        >
          Back to All Exercises
        </Button>
      </Container>
    );
  }

  if (!exercise) {
    return (
      <Container sx={{ py: { xs: 2, sm: 4 } }} maxWidth="md">
        <Alert severity="info" variant="filled">Exercise not found.</Alert>
        <Button
          component={RouterLink}
          to="/exercises"
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          sx={{ mt: 2 }}
        >
          Back to All Exercises
        </Button>
      </Container>
    );
  }

  return (
    <Container sx={{ py: { xs: 2, sm: 4 } }} maxWidth="md">
      <Paper variant="outlined" sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
        <Button
          component={RouterLink}
          to="/exercises" // Link back to all exercises page
          variant="text"
          startIcon={<ArrowBackIcon />}
          sx={{ mb: 2, color: 'text.secondary' }}
        >
          All Exercises
        </Button>
        <Typography variant="h3" component="h1" gutterBottom sx={{ wordBreak: 'break-word' }}>
          {exercise.name}
        </Typography>

        {exercise.animationUrl && (
          <Box sx={{ my: 3, display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden', borderRadius: 1, border: theme => `1px solid ${theme.palette.divider}`, background: '#f5f5f5' }}>
            {exercise.animationUrl.endsWith('.gif') || exercise.animationUrl.startsWith('data:image/gif') ? (
              <CardMedia
                component="img"
                src={exercise.animationUrl}
                alt={`${exercise.name} animation`}
                sx={{ maxWidth: '100%', height: 'auto', maxHeight: '400px', objectFit: 'contain' }}
              />
            ) : exercise.animationUrl.includes('youtube.com/embed') || exercise.animationUrl.includes('youtu.be/') ? (
              <Box sx={{position: 'relative', paddingBottom: '56.25%', /* 16:9 */ height: 0, overflow: 'hidden', width: '100%'}}>
                <iframe
                  src={exercise.animationUrl.replace("watch?v=", "embed/").replace("youtu.be/", "youtube.com/embed/")}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title={`${exercise.name} video`}
                  style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                />
              </Box>
            ) : (
              <Typography variant="body2" color="text.secondary" sx={{p:2, textAlign:'center'}}>
                Animation/Video URL is not a direct GIF or YouTube embed link. <br/>
                <Link href={exercise.animationUrl} target="_blank" rel="noopener noreferrer" sx={{ml:0.5}}>
                  View content here
                </Link>
              </Typography>
            )}
          </Box>
        )}

        <Typography variant="h5" component="h2" sx={{ mt: exercise.animationUrl ? 3 : 0, mb: 1.5 }}>
          Description
        </Typography>
        <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', color: 'text.secondary', lineHeight: 1.7 }}>
          {exercise.description}
        </Typography>

        <Typography variant="caption" display="block" color="text.disabled" sx={{ mt: 4, textAlign: 'right' }}>
          Added by: {exercise.authorName || 'N/A'} on {new Date(exercise.createdAt).toLocaleDateString()}
        </Typography>
      </Paper>
    </Container>
  );
};

export default ExerciseDetailPage;
