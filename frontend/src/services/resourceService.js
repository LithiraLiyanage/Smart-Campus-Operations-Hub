import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/resources';

/**
 * Service to handle API requests for Facilities Resource Management
 */
export const resourceService = {
  // Get all resources
  getAllResources: async () => {
    try {
      const response = await axios.get(API_BASE_URL);
      return response.data;
    } catch (error) {
      console.error('Error fetching resources:', error);
      throw error;
    }
  },

  // Get a single resource by ID
  getResourceById: async (id) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching resource with id ${id}:`, error);
      throw error;
    }
  },

  // Create a new resource
  createResource: async (resourceData) => {
    try {
      const response = await axios.post(API_BASE_URL, resourceData);
      return response.data;
    } catch (error) {
      console.error('Error creating resource:', error);
      throw error;
    }
  },

  // Search/Filter resources
  searchResources: async (filters) => {
    try {
      // Build query string from non-empty filters
      const params = new URLSearchParams();
      Object.keys(filters).forEach(key => {
        if (filters[key]) {
          params.append(key, filters[key]);
        }
      });
      
      const response = await axios.get(`${API_BASE_URL}/search?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error searching resources:', error);
      throw error;
    }
  }
};
