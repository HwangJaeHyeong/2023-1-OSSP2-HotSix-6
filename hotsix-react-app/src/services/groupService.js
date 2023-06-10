import axios from 'axios';

const API_URL = 'http://localhost:8080/api/groups';

export const getMyGroups = async () => {
  try {
    const response = await axios.get(`${API_URL}/my-groups`);
    return response.data;
  } catch (error) {
    console.error('Error fetching groups:', error);
    return [];
  }
};