// src/App.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { Typography, CircularProgress } from '@mui/material'; // Added Typography, CircularProgress

// Import Page Components
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AllExercisesPage from './pages/AllExercisesPage';
import TrainerDashboardPage from './pages/TrainerDashboardPage';
import TraineeDashboardPage from './pages/TraineeDashboardPage';
import NotFoundPage from './pages/NotFoundPage';

// ProtectedRoute component
const ProtectedRoute = ({ children, roles }) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    // Consistent full page centered loader for protected route check
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 'calc(100vh - 120px)' /* Adjust height considering navbar/footer */ }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (roles && !roles.includes(user?.role)) {
    // If user's role is not allowed, redirect to a fallback or home
    // Or show an unauthorized message
    return <Navigate to="/" replace />; // Or an unauthorized page
  }

  return children;
};

// Layout components (optional, but good for structure)
import Navbar from './components/layout/Navbar'; // Import Navbar

import { Container, Box } from '@mui/material'; // Import Container and Box
// Typography and CircularProgress are already imported above

const MainLayout = ({ children }) => (
  <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
    <Navbar />
    <Container component="main" sx={{ flexGrow: 1, py: { xs: 2, sm: 3 } /* Responsive padding */ }} maxWidth={false}> {/* Use full width */}
      {children}
    </Container>
    <Box component="footer" sx={{ py: 2, textAlign: 'center', backgroundColor: 'background.paper', borderTop: (theme) => `1px solid ${theme.palette.divider}` }}>
      <Typography variant="body2" color="text.secondary">
        © {new Date().getFullYear()} Gimmy Fitness App
      </Typography>
    </Box>
  </Box>
);


function App() {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    // Centered full page loader
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <MainLayout>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={isAuthenticated ? <Navigate to={user?.role === 'trainer' ? '/trainer/dashboard' : '/trainee/dashboard'} /> : <LoginPage />} />
        <Route path="/register" element={isAuthenticated ? <Navigate to={user?.role === 'trainer' ? '/trainer/dashboard' : '/trainee/dashboard'} /> : <RegisterPage />} />
        <Route path="/exercises" element={<AllExercisesPage />} />

        {/* Protected Routes for Trainer */}
        <Route
          path="/trainer/dashboard"
          element={
            <ProtectedRoute roles={['trainer']}>
              <TrainerDashboardPage />
            </ProtectedRoute>
          }
        />
        {/* Add more trainer routes here */}

        {/* Protected Routes for Trainee */}
        <Route
          path="/trainee/dashboard"
          element={
            <ProtectedRoute roles={['trainee']}>
              <TraineeDashboardPage />
            </ProtectedRoute>
          }
        />
        {/* Add more trainee routes here */}

        {/* Fallback for unknown routes */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </MainLayout>
  );
}

export default App;
