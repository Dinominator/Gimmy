// src/components/GimmyLogo.jsx
import React from 'react';
import Typography from '@mui/material/Typography';
import { Link as RouterLink } from 'react-router-dom';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter'; // Using the existing icon as part of logo

const GimmyLogo = ({ size = 'h6' }) => { // size can be 'h6', 'h5', etc.
  return (
    <Typography
      variant={size}
      component={RouterLink}
      to="/"
      sx={{
        display: 'flex',
        alignItems: 'center',
        textDecoration: 'none',
        color: 'inherit',
        fontFamily: '"Roboto Condensed", "Roboto", "Arial", sans-serif', // A slightly more condensed font for logo
        fontWeight: 700,
        letterSpacing: '.5px'
      }}
    >
      <FitnessCenterIcon sx={{ mr: 0.5 }} />
      Gimmy
    </Typography>
  );
};
export default GimmyLogo;
