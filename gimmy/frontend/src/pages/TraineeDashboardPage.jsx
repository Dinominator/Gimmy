// src/pages/TraineeDashboardPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Container, Typography, Box, Paper, Tabs, Tab, Alert, CircularProgress, List, ListItem, ListItemText, Button, Card, CardContent, Grid, ListItemAvatar, Avatar, Checkbox, IconButton } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';

// TabPanel component
function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div role="tabpanel" hidden={value !== index} id={`trainee-tabpanel-${index}`} aria-labelledby={`trainee-tab-${index}`} {...other}>
      {value === index && (<Box sx={{ pt:2, pb:3 }}>{children}</Box>)}
    </div>
  );
}

const TraineeDashboardPage = () => {
  const { user } = useAuth();
  const [currentTab, setCurrentTab] = useState(0);

  const [myPlan, setMyPlan] = useState(null);
  const [planLoading, setPlanLoading] = useState(false);
  const [planError, setPlanError] = useState('');

  const [requests, setRequests] = useState([]);
  const [requestsLoading, setRequestsLoading] = useState(false);
  const [requestsError, setRequestsError] = useState('');
  const [responseLoading, setResponseLoading] = useState({}); // For individual request button loading

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const fetchMyPlan = useCallback(async () => {
    if(!user) return;
    setPlanLoading(true); setPlanError('');
    try {
      // TODO: Replace with actual API call: const planData = await getMyWeeklyPlan(user.uid, /* current week */);
      await new Promise(resolve => setTimeout(resolve, 700));
      const today = new Date();
      const monday = new Date(today);
      monday.setDate(today.getDate() - today.getDay() + (today.getDay() === 0 ? -6 : 1));
      setMyPlan({
        id: 'plan123', weekStartDate: monday.toISOString().split('T')[0],
        dailySessions: {
          monday: [ {id: 'sess1ex1', exerciseId: 'ex1', exerciseName: 'Push Ups', sets:3, reps:10, notes: 'Focus on form', completed:false}, {id: 'sess1ex2', exerciseId: 'ex2', exerciseName: 'Squats', sets:3, reps:12, notes: '', completed:true} ],
          tuesday: [],
          wednesday: [ {id: 'sess2ex1', exerciseId: 'ex3', exerciseName: 'Pull Ups (Assisted)', sets:3, reps:5, notes: 'Use band', completed:false}, {id: 'sess2ex2', exerciseId: 'ex4', exerciseName: 'Plank', sets:3, reps: '60s', notes: '', completed:false} ],
          thursday: [], friday: [], saturday: [], sunday: [], // Ensure all days exist for mapping
        }
      });
    } catch (err) { setPlanError('Failed to fetch training plan.'); }
    finally { setPlanLoading(false); }
  }, [user]);

  const fetchConnectionRequests = useCallback(async () => {
    if(!user) return;
    setRequestsLoading(true); setRequestsError('');
    try {
      // TODO: Replace with actual API call: const requestData = await getMyConnectionRequests();
      await new Promise(resolve => setTimeout(resolve, 500));
      setRequests([
         { id: 'req1', trainerId: 'trainer1', trainerName: 'Test Trainer Alpha', status: 'pending', requestedAt: new Date(Date.now() - 86400000).toISOString() },
         { id: 'req2', trainerId: 'trainer2', trainerName: 'Test Trainer Beta', status: 'accepted', requestedAt: new Date(Date.now() - 172800000).toISOString() },
      ]);
    } catch (err) { setRequestsError('Failed to fetch connection requests.'); }
    finally { setRequestsLoading(false); }
  }, [user]);

  useEffect(() => {
    if (currentTab === 0) fetchMyPlan();
    else if (currentTab === 1) fetchConnectionRequests();
  }, [currentTab, fetchMyPlan, fetchConnectionRequests]);

  const handleRespondRequest = async (requestId, responseStatus) => {
    setResponseLoading(prev => ({...prev, [requestId]: true}));
    setRequestsError('');
    try {
      // TODO: Replace with actual API call: await respondToConnectionRequest(requestId, responseStatus);
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API
      alert(`Request ${requestId} ${responseStatus} - TBD. Implement with actual service call.`);
      fetchConnectionRequests(); // Refresh list
    } catch (error) {
      setRequestsError(`Failed to ${responseStatus} request: ` + (error.response?.data?.message || error.message));
    } finally {
      setResponseLoading(prev => ({...prev, [requestId]: false}));
    }
  };

  const handleMarkExerciseComplete = async (dayKey, exerciseSessId, currentCompletedStatus) => {
    // Optimistic update for UI responsiveness
    const newCompletedStatus = !currentCompletedStatus;
    setMyPlan(prevPlan => {
      if (!prevPlan) return null;
      const updatedSessions = { ...prevPlan.dailySessions };
      updatedSessions[dayKey] = updatedSessions[dayKey].map(ex =>
        ex.id === exerciseSessId ? { ...ex, completed: newCompletedStatus } : ex
      );
      return { ...prevPlan, dailySessions: updatedSessions };
    });

    try {
      // TODO: Replace with actual API call: await updateExerciseCompletion(myPlan.id, dayKey, exerciseSessId, newCompletedStatus);
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API
      // If API call fails, revert the optimistic update:
      // fetchMyPlan(); // Or setMyPlan back to previous state
    } catch (error) {
      setPlanError('Failed to update exercise completion. Reverting.');
      // Revert optimistic update
      setMyPlan(prevPlan => {
        if (!prevPlan) return null;
        const revertedSessions = { ...prevPlan.dailySessions };
        revertedSessions[dayKey] = revertedSessions[dayKey].map(ex =>
          ex.id === exerciseSessId ? { ...ex, completed: currentCompletedStatus } : ex
        );
        return { ...prevPlan, dailySessions: revertedSessions };
      });
    }
  };

  return (
    <Container sx={{ py: { xs: 2, sm: 3 } }} maxWidth="lg">
      <Typography variant="h2" component="h1" sx={{ mb: { xs: 2, sm: 4 } }}>
        Trainee Dashboard
      </Typography>
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 0 }}>
        <Tabs value={currentTab} onChange={handleTabChange} aria-label="trainee dashboard tabs" variant="scrollable" scrollButtons="auto">
          <Tab label="My Weekly Plan" id="trainee-tab-0" aria-controls="trainee-tabpanel-0" />
          <Tab label="Connection Requests" id="trainee-tab-1" aria-controls="trainee-tabpanel-1" />
        </Tabs>
      </Box>

      <TabPanel value={currentTab} index={0}>
        <Paper variant="outlined" sx={{ p: {xs:1.5, sm:3, md:4} }}>
          <Typography variant="h4" component="h2" gutterBottom>Current Week's Plan</Typography>
          {planLoading && <Box sx={{display:'flex', justifyContent:'center', p:3}}><CircularProgress /></Box>}
          {planError && <Alert severity="error" sx={{mb:2}} variant="filled">{planError}</Alert>}
          {!planLoading && !myPlan && !planError && <Typography sx={{p:3, textAlign:'center', color:'text.secondary'}}>No training plan assigned for this week yet.</Typography>}
          {myPlan && (
            <Box>
              <Typography variant="h5" component="h3" sx={{mb:2.5, fontStyle:'italic'}}>Week of: {new Date(myPlan.weekStartDate).toLocaleDateString()}</Typography>
              <Grid container spacing={2.5}>
                {Object.entries(myPlan.dailySessions || {}).map(([dayKey, sessions]) => (
                  <Grid item xs={12} md={6} lg={4} key={dayKey}>
                    <Card variant="outlined" sx={{height: '100%', display:'flex', flexDirection:'column'}}>
                      <CardContent sx={{flexGrow:1, p: 2}}>
                        <Typography variant="h6" component="div" gutterBottom sx={{textTransform: 'capitalize'}}>{dayKey}</Typography>
                        {sessions.length > 0 ? (
                          <List dense>
                            {sessions.map((ex) => (
                              <ListItem key={ex.id || ex.exerciseId} dense disablePadding sx={{mb: 0.5}}
                                secondaryAction={
                                  <IconButton edge="end" aria-label={ex.completed ? "Mark as incomplete" : "Mark as complete"} onClick={() => handleMarkExerciseComplete(dayKey, ex.id || ex.exerciseId, ex.completed)}>
                                    {ex.completed ? <CheckCircleIcon color="primary" /> : <RadioButtonUncheckedIcon />}
                                  </IconButton>
                                }>
                                <ListItemText
                                  primary={ex.exerciseName}
                                  secondary={`Sets: ${ex.sets}, Reps: ${ex.reps}${ex.notes ? ` (${ex.notes})` : ''}`}
                                  sx={{textDecoration: ex.completed ? 'line-through' : 'none', color: ex.completed ? 'text.disabled' : 'inherit', pr: '40px' /* Space for checkbox */}}
                                />
                              </ListItem>
                            ))}
                          </List>
                        ) : <Typography variant="body2" color="text.secondary" sx={{minHeight: '3.5em', display:'flex', alignItems:'center', justifyContent:'center', p:1}}>Rest day or no exercises.</Typography>}
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}
        </Paper>
      </TabPanel>

      <TabPanel value={currentTab} index={1}>
        <Paper variant="outlined" sx={{ p: {xs:1.5, sm:3, md:4} }}>
          <Typography variant="h4" component="h2" gutterBottom>My Connection Requests</Typography>
          {requestsLoading && <Box sx={{display:'flex', justifyContent:'center', p:3}}><CircularProgress /></Box>}
          {requestsError && <Alert severity="error" sx={{mb:2}} variant="filled">{requestsError}</Alert>}
          {!requestsLoading && requests.length === 0 && !requestsError && <Typography sx={{p:3, textAlign:'center', color:'text.secondary'}}>No connection requests.</Typography>}
          <List sx={{width: '100%'}}>
            {requests.map((req) => (
              <Card key={req.id} variant="outlined" sx={{mb:1.5}}>
                <ListItem
                  secondaryAction={
                    req.status === 'pending' ? (
                      <Box sx={{display: 'flex', gap: 1}}>
                        <Button size="small" variant="contained" color="primary" onClick={() => handleRespondRequest(req.id, 'accepted')} disabled={responseLoading[req.id]}>
                          {responseLoading[req.id] && responseLoading[req.id] === 'accepted' ? <CircularProgress size={20} color="inherit"/> : 'Accept'}
                        </Button>
                        <Button size="small" variant="outlined" color="secondary" onClick={() => handleRespondRequest(req.id, 'rejected')} disabled={responseLoading[req.id]}>
                          {responseLoading[req.id] && responseLoading[req.id] === 'rejected' ? <CircularProgress size={20}/> : 'Reject'}
                        </Button>
                      </Box>
                    ) : <Typography variant="body2" sx={{textTransform:'capitalize', color: req.status === 'accepted' ? 'success.main' : 'text.secondary', fontWeight:'medium'}}>{req.status}</Typography>
                  }
                >
                  <ListItemAvatar><Avatar>{req.trainerName?.charAt(0)}</Avatar></ListItemAvatar>
                  <ListItemText primary={`Request from ${req.trainerName}`} secondary={`Received: ${new Date(req.requestedAt).toLocaleDateString()}`} />
                </ListItem>
              </Card>
            ))}
          </List>
        </Paper>
      </TabPanel>
    </Container>
  );
};

export default TraineeDashboardPage;
