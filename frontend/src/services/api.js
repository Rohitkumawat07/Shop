import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://backend1-qkow.onrender.com/api/auth/login'
})

export default api
