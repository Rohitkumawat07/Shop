import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://shop-back-tacx.onrender.com/api'
})

export default api
