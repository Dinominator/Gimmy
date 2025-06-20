// src/pages/TraineeDashboardPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Container, Typography, Box, Paper, Tabs, Tab, Alert, CircularProgress, List, ListItem, ListItemText, Button, Card, CardContent, Grid, ListItemAvatar, Avatar } from '@mui/material';
// Assume services are created for fetching plans and requests
// import { getMyWeeklyPlan, updateExerciseCompletion } from '../services/trainingPlanService'; // Placeholder
// import { getMyConnectionRequests, respondToConnectionRequest } from '../services/connectionService'; // Placeholder

// TabPanel component
function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div role="tabpanel" hidden={value !== index} id={`trainee-tabpanel-${index}`} aria-labelledby={`trainee-tab-${index}`} {...other}>
      {value === index && (<Box sx={{ p: {xs:1, sm:2, md:3} } }>{children}</Box>)}
    </div>
  );
}

const TraineeDashboardPage = () => {
  const { user } = useAuth();
  const [currentTab, setCurrentTab] = useState(0);

  // Placeholder states - replace with actual data fetching
  const [myPlan, setMyPlan] = useState(null);
  const [planLoading, setPlanLoading] = useState(false);
  const [planError, setPlanError] = useState('');

  const [requests, setRequests] = useState([]);
  const [requestsLoading, setRequestsLoading] = useState(false);
  const [requestsError, setRequestsError] = useState('');

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  // Placeholder fetch functions - replace with actual service calls
  const fetchMyPlan = useCallback(async () => {
    if(!user) return;
    setPlanLoading(true);
    setPlanError('');
    try {
      // const planData = await getMyWeeklyPlan(user.uid, /* typically current week */);
      // setMyPlan(planData);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setMyPlan({ weekStartDate: '2024-01-15', dailySessions: { monday: [{exerciseId: 'ex1', exerciseName: 'Push Ups', sets:3, reps:10, completed:false}] } });
    } catch (err) {
      setPlanError('Failed to fetch training plan.');
    } finally {
      setPlanLoading(false);
    }
  }, [user]);

  const fetchConnectionRequests = useCallback(async () => {
    if(!user) return;
    setRequestsLoading(true);
    setRequestsError('');
    try {
      // const requestData = await getMyConnectionRequests();
      // setRequests(requestData);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setRequests([
        // { id: 'req1', trainerName: 'Test Trainer A', status: 'pending', requestedAt: new Date().toISOString() },
      ]);
    } catch (err) {
      setRequestsError('Failed to fetch connection requests.');
    } finally {
      setRequestsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (currentTab === 0) {
      fetchMyPlan();
    } else if (currentTab === 1) {
      fetchConnectionRequests();
    }
  }, [currentTab, fetchMyPlan, fetchConnectionRequests]);

  const handleRespondRequest = async (requestId, response) => {
    // try {
    //   await respondToConnectionRequest(requestId, response);
    //   fetchConnectionRequests(); // Refresh
    // } catch (error) {
    //   alert(`Failed to ${response} request.`);
    // }
    alert(`Request ${requestId} ${response} - TBD`);
    fetchConnectionRequests();
  };

  const handleMarkExerciseComplete = async (planId, day, exerciseEntryId, completed) => {
    // try {
    //   await updateExerciseCompletion(planId, day, exerciseEntryId, completed);
    //   fetchMyPlan(); // Refresh
    // } catch (error) {
    //  alert('Failed to update exercise completion.');
    // }
    alert(`Exercise ${exerciseEntryId} on ${day} marked as ${completed} - TBD`);
    // Optimistic update or refetch plan
  };


  return (
    <Container sx={{ py: 4 }} maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom>
        Trainee Dashboard
      </Typography>
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 0 }}>
        <Tabs value={currentTab} onChange={handleTabChange} aria-label="trainee dashboard tabs" variant="scrollable" scrollButtons="auto">
          <Tab label="My Weekly Plan" id="trainee-tab-0" aria-controls="trainee-tabpanel-0" />
          <Tab label="Connection Requests" id="trainee-tab-1" aria-controls="trainee-tabpanel-1" />
          {/* <Tab label="My Progress" id="trainee-tab-2" aria-controls="trainee-tabpanel-2" /> */}
          {/* <Tab label="Exercise Library" component={RouterLink} to="/exercises" /> */}
        </Tabs>
      </Box>

      <TabPanel value={currentTab} index={0}>
        <Paper elevation={0} sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>Current Week's Plan</Typography>
          {planLoading && <Box sx={{display:'flex', justifyContent:'center', p:2}}><CircularProgress /></Box>}
          {planError && <Alert severity="error" sx={{mb:2}}>{planError}</Alert>}
          {!planLoading && !myPlan && !planError && <Typography sx={{p:2, textAlign:'center'}}>No training plan assigned for this week yet.</Typography>}
          {myPlan && (
            <Box>
              <Typography variant="subtitle1" sx={{mb:2}}>Week of: {new Date(myPlan.weekStartDate).toLocaleDateString()}</Typography>
              {Object.entries(myPlan.dailySessions || {}).map(([day, sessions]) => (
                <Card key={day} variant="outlined" sx={{ mb: 2 }}>
                  <CardContent>
                    <Typography variant="h6" sx={{textTransform: 'capitalize'}}>{day}</Typography>
                    {sessions.length > 0 ? (
                      <List dense>
                        {sessions.map((ex, idx) => (
                          <ListItem key={idx} secondaryAction={
                            <Button size="small" variant={ex.completed ? "contained" : "outlined"} onClick={() => handleMarkExerciseComplete(myPlan.id, day, ex.exerciseId, !ex.completed)}>
                              {ex.completed ? 'Completed' : 'Mark Complete'}
                            </Button>
                          }>
                            <ListItemText primary={ex.exerciseName} secondary={`Sets: ${ex.sets}, Reps: ${ex.reps}${ex.notes ? `, Notes: ${ex.notes}` : ''}`} />
                          </ListItem>
                        ))}
                      </List>
                    ) : <Typography variant="body2" color="text.secondary">Rest day or no exercises assigned.</Typography>}
                  </CardContent>
                </Card>
              ))}
            </Box>
          )}
        </Paper>
      </TabPanel>

      <TabPanel value={currentTab} index={1}>
        <Paper elevation={0} sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>My Connection Requests</Typography>
          {requestsLoading && <Box sx={{display:'flex', justifyContent:'center', p:2}}><CircularProgress /></Box>}
          {requestsError && <Alert severity="error" sx={{mb:2}}>{requestsError}</Alert>}
          {!requestsLoading && requests.length === 0 && !requestsError && <Typography sx={{p:2, textAlign:'center'}}>No pending connection requests.</Typography>}
          <List>
            {requests.map((req) => (
              <Card key={req.id} variant="outlined" sx={{mb:1.5}}>
                <ListItem
                  secondaryAction={
                    req.status === 'pending' ? (
                      <Box>
                        <Button size="small" variant="contained" color="primary" sx={{mr:1}} onClick={() => handleRespondRequest(req.id, 'accepted')}>Accept</Button>
                        <Button size="small" variant="outlined" color="secondary" onClick={() => handleRespondRequest(req.id, 'rejected')}>Reject</Button>
                      </Box>
                    ) : <Typography variant="caption" sx={{textTransform:'capitalize'}}>{req.status}</Typography>
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
