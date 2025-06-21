// src/pages/TraineeDashboardPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Container, Typography, Box, Paper, Tabs, Tab, Alert, CircularProgress, List, ListItem, ListItemText, Button, Card, CardContent, Grid, ListItemAvatar, Avatar, Checkbox } from '@mui/material';
// import { getMyWeeklyPlan, updateExerciseCompletion } from '../services/trainingPlanService'; // Actual services needed
// import { getMyConnectionRequests, respondToConnectionRequest } from '../services/connectionService'; // Actual services needed

// TabPanel component
function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div role="tabpanel" hidden={value !== index} id={`trainee-tabpanel-${index}`} aria-labelledby={`trainee-tab-${index}`} {...other}>
      {value === index && (<Box sx={{ pt:3, pb:3 }}>{children}</Box>)}
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

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  // --- Placeholder fetch functions & handlers ---
  const fetchMyPlan = useCallback(async () => {
    if(!user) return;
    setPlanLoading(true); setPlanError('');
    try {
      // const planData = await getMyWeeklyPlan(user.uid, /* current week */); setMyPlan(planData);
      await new Promise(resolve => setTimeout(resolve, 700)); // Simulate API
      // Example plan structure - replace with actual data
      const today = new Date();
      const monday = new Date(today);
      monday.setDate(today.getDate() - today.getDay() + (today.getDay() === 0 ? -6 : 1)); // Get Monday of current week

      setMyPlan({
        id: 'plan123',
        weekStartDate: monday.toISOString().split('T')[0],
        dailySessions: {
          monday: [
            {exerciseId: 'ex1', exerciseName: 'Push Ups', sets:3, reps:10, notes: 'Focus on form', completed:false},
            {exerciseId: 'ex2', exerciseName: 'Squats', sets:3, reps:12, notes: '', completed:true}
          ],
          tuesday: [], // Rest day
          wednesday: [
            {exerciseId: 'ex3', exerciseName: 'Pull Ups (Assisted)', sets:3, reps:5, notes: 'Use band', completed:false},
            {exerciseId: 'ex4', exerciseName: 'Plank', sets:3, reps: '60s', notes: '', completed:false}
          ],
          // ... other days
        }
      });
    } catch (err) { setPlanError('Failed to fetch training plan.'); }
    finally { setPlanLoading(false); }
  }, [user]);

  const fetchConnectionRequests = useCallback(async () => {
    if(!user) return;
    setRequestsLoading(true); setRequestsError('');
    try {
      // const requestData = await getMyConnectionRequests(); setRequests(requestData);
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API
      setRequests([
         { id: 'req1', trainerName: 'Test Trainer Alpha', status: 'pending', requestedAt: new Date(Date.now() - 86400000).toISOString() }, // 1 day ago
         { id: 'req2', trainerName: 'Test Trainer Beta', status: 'accepted', requestedAt: new Date(Date.now() - 172800000).toISOString() }, // 2 days ago
      ]);
    } catch (err) { setRequestsError('Failed to fetch connection requests.'); }
    finally { setRequestsLoading(false); }
  }, [user]);

  useEffect(() => {
    if (currentTab === 0) fetchMyPlan();
    else if (currentTab === 1) fetchConnectionRequests();
  }, [currentTab, fetchMyPlan, fetchConnectionRequests]);

  const handleRespondRequest = async (requestId, response) => {
    alert(`Request ${requestId} ${response} - TBD. Implement with actual service call.`);
    // Example:
    // try {
    //   await respondToConnectionRequest(requestId, response);
    //   fetchConnectionRequests(); // Refresh list
    // } catch (error) {
    //   setRequestsError(`Failed to ${response} request: ` + (error.response?.data?.message || error.message));
    // }
  };

  const handleMarkExerciseComplete = async (day, exerciseId, completed) => {
    alert(`Exercise ${exerciseId} on ${day} marked as ${completed ? 'complete' : 'incomplete'} - TBD. Implement with actual service call.`);
    // Optimistically update UI, then call service
    // Example:
    // const updatedPlan = { ...myPlan };
    // updatedPlan.dailySessions[day] = updatedPlan.dailySessions[day].map(ex =>
    //   ex.exerciseId === exerciseId ? { ...ex, completed } : ex
    // );
    // setMyPlan(updatedPlan);
    // try {
    //   await updateExerciseCompletion(myPlan.id, day, exerciseId, completed);
    //   // Optionally re-fetch or confirm success
    // } catch (error) {
    //   setPlanError('Failed to update exercise completion.');
    //   fetchMyPlan(); // Revert optimistic update by refetching
    // }
  };

  return (
    <Container sx={{ py: { xs: 2, sm: 3 } }} maxWidth="lg">
      <Typography variant="h3" component="h1" sx={{ mb: { xs: 2, sm: 3 } }}>
        Trainee Dashboard
      </Typography>
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 0 }}>
        <Tabs value={currentTab} onChange={handleTabChange} aria-label="trainee dashboard tabs" variant="scrollable" scrollButtons="auto">
          <Tab label="My Weekly Plan" id="trainee-tab-0" aria-controls="trainee-tabpanel-0" />
          <Tab label="Connection Requests" id="trainee-tab-1" aria-controls="trainee-tabpanel-1" />
          {/* <Tab label="My Progress" id="trainee-tab-2" aria-controls="trainee-tabpanel-2" /> */}
        </Tabs>
      </Box>

      <TabPanel value={currentTab} index={0}>
        <Paper variant="outlined" sx={{ p: {xs:1.5, sm:2, md:3} }}>
          <Typography variant="h5" component="h2" gutterBottom>Current Week's Plan</Typography>
          {planLoading && <Box sx={{display:'flex', justifyContent:'center', p:3}}><CircularProgress /></Box>}
          {planError && <Alert severity="error" sx={{mb:2}}>{planError}</Alert>}
          {!planLoading && !myPlan && !planError && <Typography sx={{p:3, textAlign:'center', color:'text.secondary'}}>No training plan assigned for this week yet.</Typography>}
          {myPlan && (
            <Box>
              <Typography variant="h6" component="h3" sx={{mb:2, fontStyle:'italic'}}>Week of: {new Date(myPlan.weekStartDate).toLocaleDateString()}</Typography>
              <Grid container spacing={2}>
                {Object.entries(myPlan.dailySessions || {}).map(([day, sessions]) => (
                  <Grid item xs={12} md={6} lg={4} key={day}>
                    <Card variant="outlined" sx={{height: '100%', display:'flex', flexDirection:'column'}}>
                      <CardContent sx={{flexGrow:1}}>
                        <Typography variant="subtitle1" gutterBottom sx={{fontWeight:'bold', textTransform: 'capitalize'}}>{day}</Typography>
                        {sessions.length > 0 ? (
                          <List dense>
                            {sessions.map((ex, idx) => (
                              <ListItem key={idx} dense
                                secondaryAction={
                                  <Checkbox
                                    edge="end"
                                    onChange={(e) => handleMarkExerciseComplete(day, ex.exerciseId, e.target.checked)}
                                    checked={ex.completed}
                                    aria-label={`Mark ${ex.exerciseName} as complete`}
                                  />
                                }>
                                <ListItemText
                                  primary={ex.exerciseName}
                                  secondary={`Sets: ${ex.sets}, Reps: ${ex.reps}${ex.notes ? ` (${ex.notes})` : ''}`}
                                  sx={{textDecoration: ex.completed ? 'line-through' : 'none', color: ex.completed ? 'text.disabled' : 'text.primary'}}
                                />
                              </ListItem>
                            ))}
                          </List>
                        ) : <Typography variant="body2" color="text.secondary" sx={{minHeight: '3em', display:'flex', alignItems:'center', justifyContent:'center'}}>Rest day or no exercises assigned.</Typography>}
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
        <Paper variant="outlined" sx={{ p: {xs:1.5, sm:2, md:3} }}>
          <Typography variant="h5" component="h2" gutterBottom>My Connection Requests</Typography>
          {requestsLoading && <Box sx={{display:'flex', justifyContent:'center', p:3}}><CircularProgress /></Box>}
          {requestsError && <Alert severity="error" sx={{mb:2}}>{requestsError}</Alert>}
          {!requestsLoading && requests.length === 0 && !requestsError && <Typography sx={{p:3, textAlign:'center', color:'text.secondary'}}>No pending connection requests.</Typography>}
          <List sx={{width: '100%'}}>
            {requests.map((req) => (
              <Card key={req.id} variant="outlined" sx={{mb:1.5}}>
                <ListItem
                  secondaryAction={
                    req.status === 'pending' ? (
                      <Box sx={{display: 'flex', gap: 1}}>
                        <Button size="small" variant="contained" color="primary" onClick={() => handleRespondRequest(req.id, 'accepted')}>Accept</Button>
                        <Button size="small" variant="outlined" color="secondary" onClick={() => handleRespondRequest(req.id, 'rejected')}>Reject</Button>
                      </Box>
                    ) : <Typography variant="caption" sx={{textTransform:'capitalize', color: req.status === 'accepted' ? 'success.main' : 'text.secondary'}}>{req.status}</Typography>
                  }
                >
                  <ListItemAvatar><Avatar /></ListItemAvatar> {/* Placeholder for trainer avatar */}
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
