// src/pages/TrainerDashboardPage.jsx
import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom'; // Added for future navigation
import { useAuth } from '../contexts/AuthContext';
import { getAllExercises, addExercise, updateExercise as updateExerciseService, deleteExercise as deleteExerciseService } from '../services/exerciseService';
import { searchTrainees as searchTraineesService, sendConnectionRequest as sendRequestService, getConnectedTrainees as getConnectedTraineesService, removeTraineeConnection } from '../services/connectionService';
import ExerciseCard from '../components/ExerciseCard';
import AddExerciseModal from '../components/AddExerciseModal';
import ConfirmDialog from '../components/ConfirmDialog'; // Import ConfirmDialog
import { Container, Typography, Grid, Button, CircularProgress, Alert, Fab, TextField, Box, Paper, List, ListItem, ListItemText, ListItemAvatar, Avatar, IconButton, Divider, Tabs, Tab } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import SendIcon from '@mui/icons-material/Send';
import GroupIcon from '@mui/icons-material/Group';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility'; // For View Profile

// TabPanel component for managing tabs
function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div role="tabpanel" hidden={value !== index} id={`trainer-tabpanel-${index}`} aria-labelledby={`trainer-tab-${index}`} {...other}>
      {value === index && (<Box sx={{ p: 3 }}>{children}</Box>)}
    </div>
  );
}


const TrainerDashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate(); // Initialize useNavigate

  // Exercises state
  const [myExercises, setMyExercises] = useState([]);
  const [exerciseLoading, setExerciseLoading] = useState(true);
  const [exerciseError, setExerciseError] = useState('');
  const [exerciseModalOpen, setExerciseModalOpen] = useState(false);
  const [editingExercise, setEditingExercise] = useState(null);

  // Trainees state
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState('');
  const [connectedTrainees, setConnectedTrainees] = useState([]);
  const [traineesLoading, setTraineesLoading] = useState(true);
  const [traineesError, setTraineesError] = useState('');
  const [sentRequests, setSentRequests] = useState({}); // Store traineeId: status for sent requests

  // Confirmation Dialog State
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null); // Stores a function to execute
  const [confirmTitle, setConfirmTitle] = useState('');
  const [confirmMessage, setConfirmMessage] = useState('');

  // Tabs state
  const [currentTab, setCurrentTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  // --- Exercise Management ---
  const fetchTrainerExercises = useCallback(async () => {
    if (!user) return;
    setExerciseLoading(true);
    setExerciseError('');
    try {
      const allExercises = await getAllExercises();
      setMyExercises(allExercises.filter(ex => ex.authorUid === user.uid));
    } catch (err) {
      setExerciseError(err.message || 'Failed to fetch exercises.');
    } finally {
      setExerciseLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (currentTab === 0) fetchTrainerExercises();
  }, [user, currentTab, fetchTrainerExercises]);

  const handleOpenExerciseModal = (exercise = null) => { setEditingExercise(exercise); setExerciseModalOpen(true); };
  const handleCloseExerciseModal = () => { setExerciseModalOpen(false); setEditingExercise(null); };

  const handleAddOrUpdateExercise = async (exerciseData, exerciseId = null) => {
    try {
      if (exerciseId) await updateExerciseService(exerciseId, exerciseData);
      else await addExercise(exerciseData);
      fetchTrainerExercises();
    } catch (err) { console.error("Failed to save exercise:", err); throw err; }
  };

  const openDeleteExerciseConfirm = (exerciseId) => {
      setConfirmTitle('Delete Exercise');
      setConfirmMessage('Are you sure you want to delete this exercise? This action cannot be undone.');
      setConfirmAction(() => async () => { // Pass a function to be executed
          setExerciseLoading(true);
          try {
              await deleteExerciseService(exerciseId);
              fetchTrainerExercises();
          } catch (err) {
            setExerciseError(err.message || 'Failed to delete exercise.');
            setExerciseLoading(false); // Ensure loading is false on error too
          }
      });
      setConfirmOpen(true);
  };


  // --- Trainee Management ---
  const fetchConnectedTrainees = useCallback(async () => {
    setTraineesLoading(true);
    setTraineesError('');
    try {
      const data = await getConnectedTraineesService();
      setConnectedTrainees(data);
    } catch (err) {
      setTraineesError(err.message || 'Failed to fetch connected trainees.');
    } finally {
      setTraineesLoading(false);
    }
  }, []);

  useEffect(() => {
    if (currentTab === 1 || currentTab === 2) {
        fetchConnectedTrainees();
        if (currentTab === 1) setSearchResults([]);
    }
  }, [currentTab, fetchConnectedTrainees]);


  const handleSearchTrainees = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    setSearchLoading(true);
    setSearchError('');
    try {
      const results = await searchTraineesService(searchTerm);
      setSearchResults(results);
      if (results.length === 0) setSearchError('No trainees found.');
    } catch (err) {
      setSearchError(err.message || 'Search failed.');
    } finally {
      setSearchLoading(false);
    }
  };

  const openSendRequestConfirm = (trainee) => {
      setConfirmTitle('Send Connection Request');
      setConfirmMessage(`Are you sure you want to send a connection request to ${trainee.name}?`);
      setConfirmAction(() => async () => {
          setSentRequests(prev => ({ ...prev, [trainee.id]: 'sending' }));
          try {
              await sendRequestService(trainee.id);
              setSentRequests(prev => ({ ...prev, [trainee.id]: 'sent' }));
          } catch (err) {
              setSentRequests(prev => ({ ...prev, [trainee.id]: 'failed' }));
              setSearchError(err.response?.data?.message || 'Failed to send request.');
          }
      });
      setConfirmOpen(true);
  };

  const openRemoveTraineeConfirm = (trainee) => {
      setConfirmTitle('Remove Trainee');
      setConfirmMessage(`Are you sure you want to remove ${trainee.name} from your connected trainees? This will end their training program with you.`);
      setConfirmAction(() => async () => {
          setTraineesLoading(true);
          try {
              await removeTraineeConnection(trainee.connectionId);
              fetchConnectedTrainees();
          } catch (err) {
              setTraineesError(err.message || 'Failed to remove trainee.');
              setTraineesLoading(false);
          }
      });
      setConfirmOpen(true);
  };


  // --- Confirmation Dialog Handler ---
  const handleConfirm = async () => {
      if (confirmAction) {
          await confirmAction(); // Execute the stored function
      }
      setConfirmOpen(false);
      setConfirmAction(null); // Reset action
  };

  const isAlreadyConnected = (traineeId) => connectedTrainees.some(t => t.id === traineeId);


  return (
    <Container sx={{ py: 4 }} maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom>Trainer Dashboard</Typography>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
        <Tabs value={currentTab} onChange={handleTabChange} aria-label="trainer dashboard tabs">
          <Tab label="My Exercises" id="trainer-tab-0" aria-controls="trainer-tabpanel-0" />
          <Tab label="My Trainees" id="trainer-tab-1" aria-controls="trainer-tabpanel-1" />
          <Tab label="Search Trainees" id="trainer-tab-2" aria-controls="trainer-tabpanel-2" />
          <Tab label="Training Plans" id="trainer-tab-3" aria-controls="trainer-tabpanel-3" />
        </Tabs>
      </Box>

      <ConfirmDialog
          open={confirmOpen}
          onClose={() => setConfirmOpen(false)}
          onConfirm={handleConfirm}
          title={confirmTitle}
          message={confirmMessage}
      />

      {/* Tab 0: My Exercises */}
      <TabPanel value={currentTab} index={0}>
        {exerciseError && <Alert severity="error" sx={{ mb: 2 }}>{exerciseError}</Alert>}
        <Box sx={{ mb: 2 }}>
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenExerciseModal()}>Add New Exercise</Button>
        </Box>
        {exerciseLoading && myExercises.length === 0 && <CircularProgress />}
        {!exerciseLoading && myExercises.length === 0 && !exerciseError && <Typography>You haven't added any exercises yet.</Typography>}
        <Grid container spacing={3}>
          {myExercises.map((exercise) => (
            <Grid item key={exercise.id} xs={12} sm={6} md={4}>
              <ExerciseCard exercise={exercise} showActions={true} onEdit={() => handleOpenExerciseModal(exercise)} onDelete={() => openDeleteExerciseConfirm(exercise.id)} />
            </Grid>
          ))}
        </Grid>
        <AddExerciseModal open={exerciseModalOpen} handleClose={handleCloseExerciseModal} onExerciseAdded={handleAddOrUpdateExercise} existingExercise={editingExercise} />
      </TabPanel>

      {/* Tab 1: My Trainees */}
      <TabPanel value={currentTab} index={1}>
        {traineesError && <Alert severity="error" sx={{mb:2}}>{traineesError}</Alert>}
        {traineesLoading && <CircularProgress />}
        {!traineesLoading && connectedTrainees.length === 0 && !traineesError && <Typography>You have no connected trainees yet.</Typography>}
        <List>
          {connectedTrainees.map(trainee => (
            <Paper key={trainee.id} sx={{mb:1}}>
              <ListItem
                secondaryAction={
                  <>
                    <IconButton edge="end" aria-label="view-plan" onClick={() => navigate(`/trainer/trainee/${trainee.id}/plans`)} title="Manage Training Plans">
                        <VisibilityIcon />
                    </IconButton>
                    <IconButton edge="end" aria-label="delete" onClick={() => openRemoveTraineeConfirm(trainee)} title="Remove Trainee">
                        <DeleteIcon />
                    </IconButton>
                  </>
                }
              >
                <ListItemAvatar><Avatar src={trainee.photoURL || undefined} /></ListItemAvatar>
                <ListItemText primary={trainee.name} secondary={trainee.email} />
              </ListItem>
            </Paper>
          ))}
        </List>
      </TabPanel>

      {/* Tab 2: Search Trainees */}
      <TabPanel value={currentTab} index={2}>
        <Box component="form" onSubmit={handleSearchTrainees} sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <TextField
            fullWidth label="Search by name or email" value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            variant="outlined" size="small"
          />
          <Button type="submit" variant="contained" sx={{ ml: 1 }} disabled={searchLoading}><PersonSearchIcon /></Button>
        </Box>
        {searchLoading && <CircularProgress />}
        {searchError && <Alert severity={searchResults.length > 0 ? "info" : "warning"} sx={{mb:2}}>{searchError}</Alert>}
        <List>
          {searchResults.map(trainee => (
            <Paper key={trainee.id} sx={{mb:1}}>
            <ListItem
              secondaryAction={
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<SendIcon />}
                  onClick={() => openSendRequestConfirm(trainee)}
                  disabled={sentRequests[trainee.id] === 'sending' || sentRequests[trainee.id] === 'sent' || isAlreadyConnected(trainee.id)}
                >
                  {isAlreadyConnected(trainee.id) ? 'Connected' : (sentRequests[trainee.id] === 'sending' ? 'Sending...' : (sentRequests[trainee.id] === 'sent' ? 'Request Sent' : 'Send Request'))}
                </Button>
              }
            >
              <ListItemAvatar><Avatar src={trainee.photoURL || undefined}/></ListItemAvatar>
              <ListItemText primary={trainee.name} secondary={trainee.email} />
            </ListItem>
            </Paper>
          ))}
        </List>
      </TabPanel>

      {/* Tab 3: Training Plans (Placeholder) */}
      <TabPanel value={currentTab} index={3}>
          <Typography variant="h6">Training Plan Management</Typography>
          <Typography>Select a trainee from "My Trainees" to manage their training plan here, or navigate via the "Manage Training Plans" button on a trainee in the "My Trainees" list.</Typography>
          {/* Future: Component to select trainee and manage their plans */}
      </TabPanel>

    </Container>
  );
};

export default TrainerDashboardPage;
