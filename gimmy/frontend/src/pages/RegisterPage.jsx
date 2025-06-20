// src/pages/RegisterPage.jsx
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { Avatar, Button, CssBaseline, TextField, FormControl, FormControlLabel, Radio, RadioGroup, FormLabel, Link, Grid, Box, Typography, Container, CircularProgress } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { GoogleLogin } from '@react-oauth/google'; // Import GoogleLogin component

export default function RegisterPage() {
  const { register, googleLogin: appGoogleLogin } = useAuth(); // Renamed to avoid conflict
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'trainee',
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
      const userData = await register({ name: formData.name, email: formData.email, password: formData.password, role: formData.role });
      navigate(userData.role === 'trainer' ? '/trainer/dashboard' : '/trainee/dashboard');
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
      // tokenResponse.credential IS the ID token when using <GoogleLogin /> component
      await appGoogleLogin(tokenResponse.credential, formData.role);
      navigate(formData.role === 'trainer' ? '/trainer/dashboard' : '/trainee/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Google Sign-Up failed.');
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleGoogleError = (errorResponse) => {
    console.error('Google Sign-In Error:', errorResponse);
    setError('Google Sign-Up failed. Please try again.');
    setGoogleLoading(false);
  };


  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}><LockOutlinedIcon /></Avatar>
        <Typography component="h1" variant="h5">Sign up</Typography>
        {error && <Typography color="error" sx={{ mt: 1 }}>{error}</Typography>}
        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}><TextField fullWidth label="Full Name" name="name" required autoComplete="name" autoFocus value={formData.name} onChange={handleChange} disabled={loading || googleLoading} /></Grid>
            <Grid item xs={12}><TextField fullWidth label="Email Address" name="email" type="email" required autoComplete="email" value={formData.email} onChange={handleChange} disabled={loading || googleLoading} /></Grid>
            <Grid item xs={12}><TextField fullWidth label="Password" name="password" type="password" required value={formData.password} onChange={handleChange} disabled={loading || googleLoading} /></Grid>
            <Grid item xs={12}><TextField fullWidth label="Confirm Password" name="confirmPassword" type="password" required value={formData.confirmPassword} onChange={handleChange} disabled={loading || googleLoading} /></Grid>
            <Grid item xs={12}>
              <FormControl component="fieldset" disabled={loading || googleLoading}>
                <FormLabel component="legend">Register as:</FormLabel>
                <RadioGroup row name="role" value={formData.role} onChange={handleChange}>
                  <FormControlLabel value="trainee" control={<Radio />} label="Trainee" />
                  <FormControlLabel value="trainer" control={<Radio />} label="Trainer" />
                </RadioGroup>
              </FormControl>
            </Grid>
          </Grid>
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 1 }} disabled={loading || googleLoading}>
            {loading ? <CircularProgress size={24} /> : 'Sign Up'}
          </Button>

          {/* GoogleLogin Button */}
          <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%', mb: 2 }}>
            {googleLoading ? <CircularProgress /> :
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                useOneTap // Optional: for one-tap sign-in experience
                // width="364px" // Adjust width as needed or let it be default
                shape="rectangular" // rectangular, circle, pill
                theme="outline" // outline, filled_blue, filled_black
                logo_alignment="left" // left, center
                text="signup_with" // signup_with, signin_with, continue_with
              />
            }
          </Box>

          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link component={RouterLink} to="/login" variant="body2">Already have an account? Sign in</Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
}
