import axios from 'axios';

const MANAGEMENT_API_URL = import.meta.env.VITE_API_BASE_URL || 'https://mflix-movies.onrender.com';
const LOCAL_STORAGE_KEY = 'local_movies';

// Helper functions for localStorage
const getLocalMovies = () => {
  try {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return {};
  }
};

const saveLocalMovies = (movies) => {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(movies));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

// GET all movies (API + localStorage)
export const fetchMovies = async () => {
  try {
    const response = await axios.get(`${MANAGEMENT_API_URL}/movies`);
    const apiMovies = response.data?.data || response.data?.movies || response.data || [];
    
    // Get locally stored movies (added/edited)
    const localMovies = getLocalMovies();
    
    // Merge: local movies override API movies with same ID, plus new local movies
    const apiMovieIds = new Set(apiMovies.map(m => m._id));
    const mergedMovies = [...apiMovies];
    
    // Update existing movies with local edits and add new local movies
    Object.entries(localMovies).forEach(([id, movie]) => {
      const index = mergedMovies.findIndex(m => m._id === id);
      if (index !== -1) {
        // Override API movie with local edit
        mergedMovies[index] = movie;
      } else {
        // Add new local movie
        mergedMovies.unshift(movie);
      }
    });
    
    console.log(' Fetched movies:', {
      fromAPI: apiMovies.length,
      fromLocal: Object.keys(localMovies).length,
      merged: mergedMovies.length
    });
    
    return { status: 'success', count: mergedMovies.length, data: mergedMovies };
  } catch (error) {
    console.error('Error fetching movies:', error);
    throw error;
  }
};

// GET single movie
export const fetchMovieById = async (id) => {
  try {
    // Check localStorage first
    const localMovies = getLocalMovies();
    if (localMovies[id]) {
      return { data: localMovies[id] };
    }
    
    // Fall back to API
    const response = await axios.get(`${MANAGEMENT_API_URL}/movies/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching movie:', error);
    throw error;
  }
};

// CREATE movie (localStorage since API doesn't persist)
export const createMovie = async (movieData) => {
  try {
    // Try API call (it will return a movie object with ID)
    const response = await axios.post(`${MANAGEMENT_API_URL}/movies`, movieData);
    const newMovie = response.data?.data || response.data;
    
    // Save to localStorage for persistence
    const localMovies = getLocalMovies();
    localMovies[newMovie._id] = newMovie;
    saveLocalMovies(localMovies);
    
    console.log(' Movie saved to localStorage:', newMovie._id);
    
    return response.data;
  } catch (error) {
    console.error('Error creating movie:', error);
    throw error;
  }
};

// UPDATE movie (localStorage since API doesn't persist)
export const updateMovie = async (id, movieData) => {
  try {
    // Try API call
    const response = await axios.patch(`${MANAGEMENT_API_URL}/movies/${id}`, movieData);
    const updatedMovie = response.data?.data || response.data;
    
    // Save to localStorage for persistence
    const localMovies = getLocalMovies();
    localMovies[id] = updatedMovie;
    saveLocalMovies(localMovies);
    
    console.log(' Movie update saved to localStorage:', id);
    
    return response.data;
  } catch (error) {
    console.error('Error updating movie:', error);
    throw error;
  }
};

// DELETE movie (localStorage)
export const deleteMovie = async (id) => {
  try {
    // Try API call
    await axios.delete(`${MANAGEMENT_API_URL}/movies/${id}`);
    
    // Remove from localStorage
    const localMovies = getLocalMovies();
    delete localMovies[id];
    saveLocalMovies(localMovies);
    
    console.log(' Movie removed from localStorage:', id);
    
    return { status: 'success' };
  } catch (error) {
    console.error('Error deleting movie:', error);
    throw error;
  }
};