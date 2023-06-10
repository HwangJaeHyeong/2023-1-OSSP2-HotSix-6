import { API_URL } from '@constants/baseUrl'
import axios from 'axios'

export const getMyGroups = async () => {
  try {
    const response = await axios.get(`${API_URL}/my-groups`)
    return response.data
  } catch (error) {
    console.error('Error fetching groups:', error)
    return []
  }
}
