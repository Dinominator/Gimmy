// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext.jsx';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme';
import { GoogleOAuthProvider } from '@react-oauth/google';

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

if (!googleClientId) {
  console.error("Google Client ID is not configured. Please set VITE_GOOGLE_CLIENT_ID in your .env file.");
  // Optionally render a message to the DOM
  // ReactDOM.createRoot(document.getElementById('root')).render(
  //   <React.StrictMode><div>Google Client ID is missing. App cannot initialize Google Sign-In.</div></React.StrictMode>
  // );
  // For now, let it proceed, but Google login will fail. The library might show its own errors.
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={googleClientId || ""}> {/* Pass empty string if not found, library handles it */}
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
          <AuthProvider>
            <App />
          </AuthProvider>
        </BrowserRouter>
      </ThemeProvider>
    </GoogleOAuthProvider>
  </React.StrictMode>,
);
