// src/services/exerciseService.js
import axios from 'axios'; // Using the global axios instance from AuthContext for consistency
                           // or import apiClient from './api' if that's preferred.

const API_URL = import.meta.env.VITE_API_URL;

export const getAllExercises = async () => {
  try {
    // No token needed for public routes, but axios instance might have default token.
    // Backend should not require token for GET /api/exercises
    const response = await axios.get(`${API_URL}/exercises`);
    return response.data;
  } catch (error) {
    console.error('Error fetching all exercises:', error.response?.data?.message || error.message);
    throw error;
  }
};

export const getExerciseDetails = async (exerciseId) => {
  try {
    const response = await axios.get(`${API_URL}/exercises/${exerciseId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching exercise ${exerciseId}:`, error.response?.data?.message || error.message);
    throw error;
  }
};

// Add other exercise-related API calls here (add, update, delete for trainers later)
export const addExercise = async (exerciseData) => {
  try {
      // This will use the token from AuthContext's axios default header
      const response = await axios.post(`${API_URL}/exercises`, exerciseData);
      return response.data;
  } catch (error) {
      console.error('Error adding exercise:', error.response?.data?.message || error.message);
      throw error;
  }
};

export const updateExercise = async (exerciseId, exerciseData) => {
  try {
      const response = await axios.put(`${API_URL}/exercises/${exerciseId}`, exerciseData);
      return response.data;
  } catch (error) {
      console.error('Error updating exercise:', error.response?.data?.message || error.message);
      throw error;
  }
};

export const deleteExercise = async (exerciseId) => {
  try {
      const response = await axios.delete(`${API_URL}/exercises/${exerciseId}`);
      return response.data;
  } catch (error) {
      console.error('Error deleting exercise:', error.response?.data?.message || error.message);
      throw error;
  }
};
