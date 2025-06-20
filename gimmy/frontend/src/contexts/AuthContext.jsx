// src/contexts/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;
const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('gimmyToken'));
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  axios.defaults.baseURL = API_URL;
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        try {
          const response = await axios.get('/auth/profile');
          setUser(response.data);
          setIsAuthenticated(true);
        } catch (error) {
          console.error('Failed to fetch profile or token invalid:', error);
          localStorage.removeItem('gimmyToken');
          setUser(null);
          setToken(null);
          setIsAuthenticated(false);
          delete axios.defaults.headers.common['Authorization'];
        }
      }
      setLoading(false);
    };
    fetchUserProfile();
  }, [token]);

  const login = async (email, password, asTrainer = false) => {
    try {
      const response = await axios.post('/auth/login', { email, password, attemptTrainerLogin: asTrainer });
      const { token: newToken, ...userData } = response.data;
      localStorage.setItem('gimmyToken', newToken);
      setToken(newToken);
      setUser(userData);
      setIsAuthenticated(true);
      axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
      return userData;
    } catch (error) {
      console.error('Login failed:', error.response?.data?.message || error.message);
      throw error;
    }
  };

  const googleLogin = async (idToken, role = 'trainee') => {
      try {
          const response = await axios.post('/auth/google', { idToken, role });
          const { token: newToken, ...userData } = response.data;
          localStorage.setItem('gimmyToken', newToken);
          setToken(newToken);
          setUser(userData);
          setIsAuthenticated(true);
          axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
          return userData;
      } catch (error) {
          console.error('Google login failed:', error.response?.data?.message || error.message);
          throw error;
      }
  };

  const register = async (userData) => {
      try {
          const response = await axios.post('/auth/register', userData);
          const { token: newToken, ...newUserData } = response.data;
          localStorage.setItem('gimmyToken', newToken);
          setToken(newToken);
          setUser(newUserData);
          setIsAuthenticated(true);
          axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
          return newUserData;
      } catch (error) {
          console.error('Registration failed:', error.response?.data?.message || error.message);
          throw error;
      }
  };

  const logout = () => {
    localStorage.removeItem('gimmyToken');
    setUser(null);
    setToken(null);
    setIsAuthenticated(false);
    delete axios.defaults.headers.common['Authorization'];
    // Optionally redirect to login page or home
  };

  const value = {
    user,
    token,
    isAuthenticated,
    loading,
    login,
    googleLogin,
    register,
    logout,
    setUser, // Allow updating user profile info locally if needed
  };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};
