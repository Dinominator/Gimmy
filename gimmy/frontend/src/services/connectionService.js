// src/services/connectionService.js
import axios from 'axios'; // Using the global axios instance

const API_URL = import.meta.env.VITE_API_URL;

export const searchTrainees = async (searchTerm) => {
  try {
    const response = await axios.get(`${API_URL}/connections/search-trainees`, {
      params: { searchTerm }
    });
    return response.data;
  } catch (error) {
    console.error('Error searching trainees:', error.response?.data?.message || error.message);
    throw error;
  }
};

export const sendConnectionRequest = async (traineeId) => {
  try {
    const response = await axios.post(`${API_URL}/connections/send-request`, { traineeId });
    return response.data;
  } catch (error) {
    console.error('Error sending connection request:', error.response?.data?.message || error.message);
    throw error;
  }
};

export const getConnectedTrainees = async () => {
  try {
    const response = await axios.get(`${API_URL}/connections/my-trainees`);
    return response.data;
  } catch (error) {
    console.error('Error fetching connected trainees:', error.response?.data?.message || error.message);
    throw error;
  }
};

export const removeTraineeConnection = async (connectionId) => {
  try {
    const response = await axios.delete(`${API_URL}/connections/remove-trainee/${connectionId}`);
    return response.data;
  } catch (error) {
    console.error('Error removing trainee connection:', error.response?.data?.message || error.message);
    throw error;
  }
};

export const getTraineePublicProfile = async (traineeId) => {
  try {
      const response = await axios.get(`${API_URL}/connections/trainee-profile/${traineeId}`);
      return response.data;
  } catch (error) {
      console.error('Error fetching trainee profile:', error.response?.data?.message || error.message);
      throw error;
  }
};
