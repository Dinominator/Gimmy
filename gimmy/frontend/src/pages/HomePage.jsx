// src/pages/HomePage.jsx
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Typography, Container, Button, Box } from '@mui/material';

const HomePage = () => {
  return (
    <Container maxWidth="md" sx={{ textAlign: 'center', mt: 8 }}>
      <Typography variant="h2" component="h1" gutterBottom>
        Welcome to Gimmy!
      </Typography>
      <Typography variant="h5" color="text.secondary" paragraph>
        Your ultimate remote fitness training management solution.
      </Typography>
      <Box sx={{ mt: 4 }}>
        <Button component={RouterLink} to="/register" variant="outlined" color="primary" sx={{ mr: 2 }}>
          Sign Up
        </Button>
         <Button component={RouterLink} to="/login" variant="outlined" color="secondary">
          Login
        </Button>
      </Box>
    </Container>
  );
};
export default HomePage;
