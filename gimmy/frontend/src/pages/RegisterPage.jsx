// src/pages/RegisterPage.jsx
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { Avatar, Button, TextField, Link, Grid, Box, Typography, Container, CircularProgress, Paper, Alert, Divider } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { GoogleLogin } from '@react-oauth/google';

export default function RegisterPage() {
  const { register, googleLogin: appGoogleLogin } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match.");
      return;
    }
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }
    setLoading(true);
    try {
      const registrationData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: 'trainee'
      };
      await register(registrationData);
      navigate('/trainee/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (tokenResponse) => {
    setGoogleLoading(true);
    setError('');
    try {
      await appGoogleLogin(tokenResponse.credential, 'trainee');
      navigate('/trainee/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Google Sign-Up failed.');
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleGoogleError = (errorResponse) => {
    console.error('Google Sign-Up Error:', errorResponse);
    setError('Google Sign-Up failed. Please try again.');
    setGoogleLoading(false);
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          minHeight: 'calc(100vh - 180px)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          py: 4,
        }}
      >
        <Paper variant="outlined" sx={{ p: { xs: 2, sm: 4 }, display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
          <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5" sx={{mb: 2}}>
            Sign up
          </Typography>
          {error && <Alert severity="error" sx={{ width: '100%', mb:2 }}>{error}</Alert>}
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField fullWidth label="Full Name" name="name" required autoComplete="name" autoFocus value={formData.name} onChange={handleChange} disabled={loading || googleLoading} InputLabelProps={{ shrink: true }} />
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth label="Email Address" name="email" type="email" required autoComplete="email" value={formData.email} onChange={handleChange} disabled={loading || googleLoading} InputLabelProps={{ shrink: true }} />
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth label="Password" name="password" type="password" required autoComplete="new-password" value={formData.password} onChange={handleChange} disabled={loading || googleLoading} InputLabelProps={{ shrink: true }} />
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth label="Confirm Password" name="confirmPassword" type="password" required autoComplete="new-password" value={formData.confirmPassword} onChange={handleChange} disabled={loading || googleLoading} InputLabelProps={{ shrink: true }} />
              </Grid>
            </Grid>
            <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 1 }} disabled={loading || googleLoading}>
              {loading && !googleLoading ? <CircularProgress size={24} color="inherit"/> : 'Sign Up'}
            </Button>
            <Divider sx={{ my: 2 }}>OR</Divider>
            <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%', mb: 2 }}>
              {googleLoading ? <CircularProgress /> :
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={handleGoogleError}
                  // useOneTap // Temporarily removed
                  shape="rectangular"
                  theme="outline"
                  text="signup_with"
                />
              }
            </Box>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link component={RouterLink} to="/login" variant="body2">
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}
