// src/components/AddExerciseModal.jsx
import React, { useState, useEffect } from 'react';
import { Modal, Box, Typography, TextField, Button, CircularProgress, Switch, FormControlLabel } from '@mui/material';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const AddExerciseModal = ({ open, handleClose, onExerciseAdded, existingExercise }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [animationUrl, setAnimationUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    if (existingExercise) {
      setIsEditMode(true);
      setName(existingExercise.name || '');
      setDescription(existingExercise.description || '');
      setAnimationUrl(existingExercise.animationUrl || '');
    } else {
      setIsEditMode(false);
      setName('');
      setDescription('');
      setAnimationUrl('');
    }
    setError(''); // Clear error when modal opens or exercise changes
  }, [existingExercise, open]);


  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    if (!name.trim() || !description.trim()) {
      setError('Name and Description are required.');
      return;
    }
    setLoading(true);
    try {
      // `onExerciseAdded` will internally call either addExercise or updateExercise
      await onExerciseAdded({ name, description, animationUrl: animationUrl || null }, isEditMode ? existingExercise.id : null);
      handleClose(); // Close modal on success
    } catch (err) {
      setError(err.response?.data?.message || err.message || (isEditMode ? 'Failed to update exercise.' : 'Failed to add exercise.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={handleClose} aria-labelledby="add-exercise-modal-title">
      <Box sx={style}>
        <Typography id="add-exercise-modal-title" variant="h6" component="h2">
          {isEditMode ? 'Edit Exercise' : 'Add New Exercise'}
        </Typography>
        {error && <Typography color="error" sx={{ mt: 1 }}>{error}</Typography>}
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 2 }}>
          <TextField
            margin="normal" required fullWidth id="name" label="Exercise Name" name="name"
            value={name} onChange={(e) => setName(e.target.value)} disabled={loading}
          />
          <TextField
            margin="normal" required fullWidth multiline rows={4} id="description" label="Description" name="description"
            value={description} onChange={(e) => setDescription(e.target.value)} disabled={loading}
          />
          <TextField
            margin="normal" fullWidth id="animationUrl" label="Animation URL (Optional)" name="animationUrl"
            value={animationUrl} onChange={(e) => setAnimationUrl(e.target.value)} disabled={loading}
          />
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }} disabled={loading}>
            {loading ? <CircularProgress size={24} /> : (isEditMode ? 'Save Changes' : 'Add Exercise')}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};
export default AddExerciseModal;
