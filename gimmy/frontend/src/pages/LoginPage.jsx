// src/pages/LoginPage.jsx
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link as RouterLink } from 'react-router-dom'; // Import RouterLink
import { Avatar, Button, CssBaseline, TextField, Link, Grid, Box, Typography, Container, CircularProgress } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { GoogleLogin } from '@react-oauth/google'; // Import GoogleLogin component

export default function LoginPage() {
  const { login, googleLogin: appGoogleLogin } = useAuth(); // Renamed to avoid conflict
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);


  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      const userData = await login(formData.email, formData.password);
      navigate(userData.role === 'trainer' ? '/trainer/dashboard' : '/trainee/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (tokenResponse) => {
    setGoogleLoading(true);
    setError('');
    try {
      // tokenResponse.credential IS the ID token
      const userData = await appGoogleLogin(tokenResponse.credential); // Role is determined by backend or if user already exists
      navigate(userData.role === 'trainer' ? '/trainer/dashboard' : '/trainee/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Google Sign-In failed.');
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleGoogleError = (errorResponse) => {
    console.error('Google Sign-In Error:', errorResponse);
    setError('Google Sign-In failed. Please try again.');
    setGoogleLoading(false);
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}><LockOutlinedIcon /></Avatar>
          <Typography component="h1" variant="h5">Sign in</Typography>
          {error && <Typography color="error" sx={{ mt: 1 }}>{error}</Typography>}
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
              <TextField margin="normal" required fullWidth id="email" label="Email Address" name="email" autoComplete="email" autoFocus value={formData.email} onChange={handleChange} disabled={loading || googleLoading} />
              <TextField margin="normal" required fullWidth name="password" label="Password" type="password" id="password" autoComplete="current-password" value={formData.password} onChange={handleChange} disabled={loading || googleLoading} />
              <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 1 }} disabled={loading || googleLoading}>
                  {loading ? <CircularProgress size={24} /> : 'Sign In'}
              </Button>

              {/* GoogleLogin Button */}
              <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%', mb: 2 }}>
                {googleLoading ? <CircularProgress /> :
                  <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={handleGoogleError}
                    useOneTap // Optional
                    shape="rectangular"
                    theme="outline"
                    logo_alignment="left"
                    text="signin_with" // signin_with for login page
                  />
                }
              </Box>

              <Grid container>
                  <Grid item xs>
                      {/* <Link href="#" variant="body2">Forgot password?</Link> */}
                  </Grid>
                  <Grid item>
                      <Link component={RouterLink} to="/register" variant="body2">{"Don't have an account? Sign Up"}</Link>
                  </Grid>
              </Grid>
          </Box>
      </Box>
    </Container>
  );
}
