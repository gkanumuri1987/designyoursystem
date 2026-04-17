import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

const api = axios.create({
  baseURL: API_BASE,
})

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const auth = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (email, password) => api.post('/auth/register', { email, password }),
  logout: () => {
    localStorage.removeItem('token')
    return Promise.resolve()
  },
}

export const pipelines = {
  list: () => api.get('/pipelines'),
  create: (data) => api.post('/pipelines', data),
  update: (id, data) => api.put(`/pipelines/${id}`, data),
  delete: (id) => api.delete(`/pipelines/${id}`),
  execute: (id) => api.post(`/pipelines/${id}/execute`),
}

export const jobs = {
  list: () => api.get('/jobs'),
  get: (id) => api.get(`/jobs/${id}`),
  getLogs: (id) => api.get(`/jobs/${id}/logs`),
  cancel: (id) => api.post(`/jobs/${id}/cancel`),
}

export const videos = {
  list: () => api.get('/videos'),
  get: (id) => api.get(`/videos/${id}`),
  delete: (id) => api.delete(`/videos/${id}`),
}

export default api
