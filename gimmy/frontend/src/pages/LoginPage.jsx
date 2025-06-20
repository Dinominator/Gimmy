// src/pages/LoginPage.jsx
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { Avatar, Button, CssBaseline, TextField, Link, Grid, Box, Typography, Container, CircularProgress, Paper, Divider, Alert } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { GoogleLogin } from '@react-oauth/google';

export default function LoginPage() {
  const { login, googleLogin: appGoogleLogin } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // For email/password login
  const [googleLoading, setGoogleLoading] = useState(false); // For Google login

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleLoginAttempt = async (asTrainer = false) => {
    setError('');
    setLoading(true);
    try {
      const userData = await login(formData.email, formData.password, asTrainer);
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
      const userData = await appGoogleLogin(tokenResponse.credential);
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
      {/* CssBaseline is now in main.jsx with ThemeProvider */}
      <Box
        sx={{
          minHeight: 'calc(100vh - 180px)', // Adjust based on Navbar/Footer height
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Paper elevation={3} sx={{ p: {xs: 2, sm: 3, md: 4}, display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
          <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5" sx={{ mb: 2 }}>
            Sign in
          </Typography>
          {error && <Alert severity="error" sx={{ width: '100%', mb: 2 }}>{error}</Alert>}
          <Box component="form" noValidate sx={{ mt: 1, width: '100%' }}>
            <TextField
              margin="normal" required fullWidth id="email" label="Email Address" name="email"
              autoComplete="email" autoFocus value={formData.email} onChange={handleChange}
              disabled={loading || googleLoading}
            />
            <TextField
              margin="normal" required fullWidth name="password" label="Password" type="password" id="password"
              autoComplete="current-password" value={formData.password} onChange={handleChange}
              disabled={loading || googleLoading}
            />
            <Button
              onClick={() => handleLoginAttempt(false)} fullWidth variant="contained"
              sx={{ mt: 2, mb: 1 }} disabled={loading || googleLoading}
            >
              {loading && !googleLoading ? <CircularProgress size={24} color="inherit" /> : 'Sign In as Trainee'}
            </Button>
            <Divider sx={{ my: 2 }}>OR</Divider>
            {/* GoogleLogin Button */}
            <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%', mb: 2 }}>
              {googleLoading ? <CircularProgress /> :
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={handleGoogleError}
                  useOneTap
                  shape="rectangular"
                  theme="outline"
                  logo_alignment="left"
                  text="signin_with"
                  width="100%" // Make Google button take full width
                />
              }
            </Box>
            {/* Trainer Login Button - Moved below Google Sign In */}
            <Button
              onClick={() => handleLoginAttempt(true)} fullWidth variant="outlined"
              sx={{ mb: 2 }} disabled={loading || googleLoading}
            >
              {loading && !googleLoading ? <CircularProgress size={24} /> : 'Login as Trainer'}
            </Button>

            <Grid container justifyContent="flex-end">
                <Grid item>
                    <Link component={RouterLink} to="/register" variant="body2">
                      {"Don't have an account? Sign Up"}
                    </Link>
                </Grid>
            </Grid>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}
