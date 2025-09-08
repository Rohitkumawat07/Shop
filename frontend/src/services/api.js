import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://backend1-qkow.onrender.com'
})

export default api
