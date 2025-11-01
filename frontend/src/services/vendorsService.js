import axios from 'axios'

const API_URL = 'http://localhost:3000/vendors' // Cambiar al puerto de tu backend

export default {
  async getAllVendors() {
    const response = await axios.get(API_URL)
    return response.data
  },
  async getVendor(id) {
    const response = await axios.get(`${API_URL}/${id}`)
    return response.data
  },
  async createVendor(data) {
    const response = await axios.post(API_URL, data)
    return response.data
  },
  async updateVendor(id, data) {
    const response = await axios.patch(`${API_URL}/${id}`, data)
    return response.data
  },
  async deleteVendor(id) {
    const response = await axios.delete(`${API_URL}/${id}`)
    return response.data
  },
}
