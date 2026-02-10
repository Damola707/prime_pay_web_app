import axios from 'axios';

const MANAGEMENT_API_URL = import.meta.env.VITE_API_BASE_URL || 'https://mflix-movies.onrender.com';

// GET all movies
export const fetchMovies = async () => {
  try {
    const response = await axios.get(`${MANAGEMENT_API_URL}/movies`);
    return response.data;
  } catch (error) {
    console.error('Error fetching movies:', error);
    throw error;
  }
};

// GET single movie
export const fetchMovieById = async (id) => {
  try {
    const response = await axios.get(`${MANAGEMENT_API_URL}/movies/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching movie:', error);
    throw error;
  }
};

// CREATE movie
export const createMovie = async (movieData) => {
  try {
    const response = await axios.post(`${MANAGEMENT_API_URL}/movies`, movieData);
    return response.data;
  } catch (error) {
    console.error('Error creating movie:', error);
    throw error;
  }
};

// UPDATE movie
export const updateMovie = async (id, movieData) => {
  try {
    const response = await axios.patch(`${MANAGEMENT_API_URL}/movies/${id}`, movieData);
    return response.data;
  } catch (error) {
    console.error('Error updating movie:', error);
    throw error;
  }
};

// DELETE movie
export const deleteMovie = async (id) => {
  try {
    const response = await axios.delete(`${MANAGEMENT_API_URL}/movies/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting movie:', error);
    throw error;
  }
};