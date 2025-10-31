import axios from 'axios'

const API_URL = 'http://localhost:3000/users' // Cambiar al puerto de tu backend

export default {
  async getAllUsers() {
    const response = await axios.get(API_URL)
    return response.data
  },
  async getUser(id) {
    const response = await axios.get(`${API_URL}/${id}`)
    return response.data
  },
  async createUser(data) {
    const response = await axios.post(API_URL, data)
    return response.data
  },
  async updateUser(id, data) {
    const response = await axios.patch(`${API_URL}/${id}`, data)
    return response.data
  },
  async deleteUser(id) {
    const response = await axios.delete(`${API_URL}/${id}`)
    return response.data
  },

  
}
