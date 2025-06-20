// src/pages/TrainerDashboardPage.jsx
import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getAllExercises, addExercise, updateExercise as updateExerciseService, deleteExercise as deleteExerciseService } from '../services/exerciseService';
import { searchTrainees as searchTraineesService, sendConnectionRequest as sendRequestService, getConnectedTrainees as getConnectedTraineesService, removeTraineeConnection } from '../services/connectionService';
import ExerciseCard from '../components/ExerciseCard';
import AddExerciseModal from '../components/AddExerciseModal';
import ConfirmDialog from '../components/ConfirmDialog';
import { Container, Typography, Grid, Button, CircularProgress, Alert, TextField, Box, Paper, List, ListItem, ListItemText, ListItemAvatar, Avatar, IconButton, Divider, Tabs, Tab } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import SendIcon from '@mui/icons-material/Send';
// import GroupIcon from '@mui/icons-material/Group'; // Not used in final diff
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditCalendarIcon from '@mui/icons-material/EditCalendar'; // For manage plan button
import HistoryEduIcon from '@mui/icons-material/HistoryEdu'; // For view history button
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';


// TabPanel component for managing tabs
function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div role="tabpanel" hidden={value !== index} id={`trainer-tabpanel-${index}`} aria-labelledby={`trainer-tab-${index}`} {...other}>
      {value === index && (<Box sx={{ pt: 3, pb: 3 }}>{children}</Box>)} {/* Adjusted padding */}
    </div>
  );
}

// Dummy function, replace with actual logic if needed for plan management
const handleSelectTraineeForPlan = (trainee) => {
    alert(`Manage plan for ${trainee.name} - TBD. Navigating to their plan page...`);
    // navigate(`/trainer/trainee/${trainee.id}/plans`); // Example navigation
};
const handleOpenTraineeHistoryModal = (trainee) => {
    alert(`View history for ${trainee.name} - TBD`);
};
const changeWeek = (offset) => {
    alert(`Change week by ${offset} - TBD`);
};
const handleOpenAddExerciseToPlanModal = (date) => {
    alert(`Add exercise to plan for ${date} - TBD`);
};
const handleSaveCurrentPlan = () => {
    alert('Save current plan - TBD');
};


const TrainerDashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

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
  const [sentRequests, setSentRequests] = useState({});

  // Confirmation Dialog State
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [confirmTitle, setConfirmTitle] = useState('');
  const [confirmMessage, setConfirmMessage] = useState('');

  // Tabs state
  const [currentTab, setCurrentTab] = useState(0);

  // Plan management related states (placeholders for now)
  const [selectedTraineeForPlan, setSelectedTraineeForPlan] = useState(null);
  const [currentWeekStartDate, setCurrentWeekStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [planLoading, setPlanLoading] = useState(false);
  const [planError, setPlanError] = useState('');
  const [isPlanUnchanged, setIsPlanUnchanged] = useState(true);
  const daysOfWeek = [ // Dummy data
    { name: 'Monday', date: '2024-01-01', exercises: [] },
    { name: 'Tuesday', date: '2024-01-02', exercises: [] },
  ];


  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
    if (newValue !== 1) { // If not "My Trainees" tab, clear selected trainee for plan
        setSelectedTraineeForPlan(null);
    }
  };

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
      setConfirmAction(() => async () => {
          setExerciseLoading(true);
          try {
              await deleteExerciseService(exerciseId);
              fetchTrainerExercises();
          } catch (err) {
            setExerciseError(err.message || 'Failed to delete exercise.');
            setExerciseLoading(false);
          }
      });
      setConfirmOpen(true);
  };

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
    if (currentTab === 1) {
        fetchConnectedTrainees();
        setSearchResults([]);
    } else if (currentTab === 2) {
        // Optionally fetch connected trainees here too if needed for isAlreadyConnected logic,
        // or rely on the fact that it's loaded if user visited tab 1
        if(connectedTrainees.length === 0 && !traineesLoading) fetchConnectedTrainees();
    }
  }, [currentTab, fetchConnectedTrainees, connectedTrainees.length, traineesLoading]);


  const handleSearchTrainees = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    setSearchLoading(true);
    setSearchError('');
    try {
      const results = await searchTraineesService(searchTerm);
      setSearchResults(results);
      if (results.length === 0) setSearchError('No trainees found matching your search.');
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
          // No need to setTraineesLoading(true) here as the list update will have its own loading state
          try {
              await removeTraineeConnection(trainee.connectionId);
              fetchConnectedTrainees();
          } catch (err) {
              setTraineesError(err.message || 'Failed to remove trainee.');
          }
      });
      setConfirmOpen(true);
  };

  const handleConfirm = async () => {
      if (confirmAction) {
          await confirmAction();
      }
      setConfirmOpen(false);
      setConfirmAction(null);
  };

  const isAlreadyConnected = (traineeId) => connectedTrainees.some(t => t.id === traineeId);

  // Function to set the selected trainee for plan management
  const handleManageTraineePlan = (trainee) => {
    setSelectedTraineeForPlan(trainee);
    setCurrentTab(3); // Switch to Training Plans tab
    // Fetch plans for this trainee (logic to be added in plan management subtask)
  };


  return (
    <Container sx={{ py: 4 }} maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom>Trainer Dashboard</Typography>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 0 }}> {/* Reduced mb for closer content */}
        <Tabs value={currentTab} onChange={handleTabChange} aria-label="trainer dashboard tabs" variant="scrollable" scrollButtons="auto">
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

      <TabPanel value={currentTab} index={0}>
        <Paper elevation={0} sx={{ p: {xs:1, sm:2, md:3} }}> {/* Use Paper for tab content section */}
          <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap:'wrap' }}>
            <Typography variant="h6" sx={{mb: {xs:1, sm:0}}}>My Created Exercises</Typography>
            <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenExerciseModal()}>Add New Exercise</Button>
          </Box>
          {exerciseError && <Alert severity="error" sx={{ mb: 2 }}>{exerciseError}</Alert>}
          {exerciseLoading && myExercises.length === 0 && <Box sx={{display:'flex', justifyContent:'center', p:2}}><CircularProgress /></Box>}
          {!exerciseLoading && myExercises.length === 0 && !exerciseError && <Typography sx={{p:2, textAlign:'center'}}>You haven't added any exercises yet.</Typography>}
          <Grid container spacing={3}>
            {myExercises.map((exercise) => (
              <Grid item key={exercise.id} xs={12} sm={6} md={4} lg={3}>
                <ExerciseCard exercise={exercise} showActions={true} onEdit={() => handleOpenExerciseModal(exercise)} onDelete={() => openDeleteExerciseConfirm(exercise.id)} />
              </Grid>
            ))}
          </Grid>
          <AddExerciseModal open={exerciseModalOpen} handleClose={handleCloseExerciseModal} onExerciseAdded={handleAddOrUpdateExercise} existingExercise={editingExercise} />
        </Paper>
      </TabPanel>

      <TabPanel value={currentTab} index={1}>
        <Paper elevation={0} sx={{ p: {xs:1, sm:2, md:3} }}>
          <Typography variant="h6" gutterBottom>My Connected Trainees</Typography>
          {traineesError && <Alert severity="error" sx={{mb:2}}>{traineesError}</Alert>}
          {traineesLoading && <Box sx={{display:'flex', justifyContent:'center', p:2}}><CircularProgress /></Box>}
          {!traineesLoading && connectedTrainees.length === 0 && !traineesError && <Typography sx={{p:2, textAlign:'center'}}>You have no connected trainees yet. Use the "Search Trainees" tab to find and connect with trainees.</Typography>}
          <List>
            {connectedTrainees.map(trainee => (
              <Card key={trainee.id} sx={{mb:1.5}} variant="outlined">
                <ListItem
                  secondaryAction={
                    <>
                      <IconButton edge="end" aria-label="manage-plan" title="Manage Training Plans" onClick={() => handleManageTraineePlan(trainee)}>
                          <EditCalendarIcon />
                      </IconButton>
                      <IconButton edge="end" aria-label="delete-connection" title="Remove Trainee" onClick={() => openRemoveTraineeConfirm(trainee)}>
                          <DeleteIcon />
                      </IconButton>
                    </>
                  }
                >
                  <ListItemAvatar><Avatar src={trainee.photoURL || undefined} /></ListItemAvatar>
                  <ListItemText primary={trainee.name} secondary={trainee.email} />
                </ListItem>
              </Card>
            ))}
          </List>
        </Paper>
      </TabPanel>

      <TabPanel value={currentTab} index={2}>
        <Paper elevation={0} sx={{ p: {xs:1, sm:2, md:3} }}>
          <Typography variant="h6" gutterBottom>Search for New Trainees</Typography>
          <Box component="form" onSubmit={handleSearchTrainees} sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <TextField
              fullWidth label="Search by name or email" value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              size="small"
            />
            <Button type="submit" variant="contained" sx={{ ml: 1 }} disabled={searchLoading} aria-label="Search">
              <PersonSearchIcon />
            </Button>
          </Box>
          {searchLoading && <Box sx={{display:'flex', justifyContent:'center', p:2}}><CircularProgress /></Box>}
          {searchError && <Alert severity={searchResults.length > 0 ? "info" : "warning"} sx={{mt:1, mb:2}}>{searchError}</Alert>}
          <List>
            {searchResults.map(trainee => (
              <Card key={trainee.id} sx={{mb:1.5}} variant="outlined">
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
              </Card>
            ))}
          </List>
        </Paper>
      </TabPanel>

      <TabPanel value={currentTab} index={3}>
        <Paper elevation={0} sx={{ p: {xs:1, sm:2, md:3} }}>
          {!selectedTraineeForPlan ? (
              <Box sx={{textAlign:'center', p:2}}>
                <Typography variant="h6" gutterBottom>Manage Training Plans</Typography>
                <Typography>Select a trainee from the "My Trainees" tab by clicking the <EditCalendarIcon sx={{verticalAlign:'middle', mx:0.5}}/> icon to manage their training plan.</Typography>
              </Box>
          ) : (
          <>
              <Typography variant="h5" gutterBottom>
                  Training Plan for: {selectedTraineeForPlan.name}
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexWrap:'wrap' }}>
                  <Typography variant="h6" sx={{mb: {xs:1, sm:0}}}>{`Week of ${new Date(currentWeekStartDate).toLocaleDateString()}`}</Typography>
                  <Box>
                      <IconButton onClick={() => changeWeek(-1)} aria-label="Previous Week"><ArrowBackIosNewIcon /></IconButton>
                      <IconButton onClick={() => changeWeek(1)} aria-label="Next Week"><ArrowForwardIosIcon /></IconButton>
                      <Button startIcon={<HistoryEduIcon />} onClick={() => handleOpenTraineeHistoryModal(selectedTraineeForPlan)} sx={{ ml: 1 }}>View History</Button>
                  </Box>
              </Box>

              {planLoading && <Box sx={{display:'flex', justifyContent:'center', p:2}}><CircularProgress /></Box>}
              {planError && <Alert severity="error" sx={{mb:2}}>{planError}</Alert>}

              <Grid container spacing={2}>
                  {daysOfWeek.map((day, index) => (
                      <Grid item xs={12} md={6} lg={4} key={index}> {/* Adjust grid for day cards */}
                          <Card variant="outlined" sx={{height: '100%'}}>
                              <CardContent>
                                  <Typography variant="subtitle1" gutterBottom sx={{fontWeight:'bold'}}>{day.name} ({new Date(day.date).toLocaleDateString(undefined, {month:'short', day:'numeric'})})</Typography>
                                  {!planLoading && day.exercises.length === 0 ? (
                                       <Typography variant="body2" color="text.secondary" sx={{minHeight: '4em'}}>No exercises assigned.</Typography>
                                  ) : (
                                  <List dense>
                                      {day.exercises.map((ex, exIdx) => (
                                          <ListItem key={exIdx} disablePadding>
                                              <ListItemText primary={ex.name} secondary={`${ex.sets} sets x ${ex.reps} reps`} />
                                              {/* Add actions like edit/delete exercise from plan */}
                                          </ListItem>
                                      ))}
                                  </List>
                                  )}
                                  <Button fullWidth variant="text" size="small" sx={{mt:1, color:'text.secondary'}} onClick={() => handleOpenAddExerciseToPlanModal(day.date)}>+ Add Exercise</Button>
                              </CardContent>
                          </Card>
                      </Grid>
                  ))}
              </Grid>
              <Button variant="contained" color="primary" sx={{mt:3}} onClick={handleSaveCurrentPlan} disabled={planLoading || isPlanUnchanged}>
                  {planLoading ? <CircularProgress size={24} color="inherit"/> : "Save Current Week's Plan"}
              </Button>
          </>
          )}
        </Paper>
      </TabPanel>
    </Container>
  );
};

export default TrainerDashboardPage;
