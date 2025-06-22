// src/components/ExerciseCard.jsx
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Card, CardContent, CardMedia, Typography, Box, IconButton, Link } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const defaultExerciseImage = 'https://via.placeholder.com/300x200.png?text=Exercise';

const ExerciseCard = ({ exercise, showActions = false, onEdit, onDelete }) => {
  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardMedia
        component="img"
        height="140"
        image={exercise.animationUrl || defaultExerciseImage}
        alt={exercise.name}
        onError={(e) => { e.target.onerror = null; e.target.src = defaultExerciseImage; }}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography gutterBottom variant="h5" component="div">
          <Link component={RouterLink} to={`/exercises/${exercise.id}`} sx={{ textDecoration: 'none', color: 'inherit', '&:hover': { textDecoration: 'underline' } }}>
            {exercise.name}
          </Link>
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          Author: {exercise.authorName || 'N/A'} {/* Ensure authorName is part of exercise object */}
        </Typography>
        <Typography variant="body2" color="text.secondary" component="p" sx={{
          display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: 3,
          overflow: 'hidden', textOverflow: 'ellipsis', minHeight: '3.6em'
        }}>
          {exercise.description}
        </Typography>
      </CardContent>
      {showActions && (onEdit || onDelete) && (
        <Box sx={{ p: 1, display: 'flex', justifyContent: 'flex-end' }}>
          {onEdit && <IconButton aria-label="edit" onClick={() => onEdit(exercise)}><EditIcon /></IconButton>}
          {onDelete && <IconButton aria-label="delete" onClick={() => onDelete(exercise.id)}><DeleteIcon /></IconButton>}
        </Box>
      )}
    </Card>
  );
};
export default ExerciseCard;
