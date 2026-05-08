import api from './api'

export const getAllCakes = () => api.get('/cakes')
export const getCakeById = (id) => api.get(`/cakes/${id}`)
export const addCake = (data) => api.post('/cakes', data)
export const addBirthdayCake = (data) => api.post('/cakes/birthday', data)
export const addWeddingCake = (data) => api.post('/cakes/wedding', data)
export const updateCake = (id, data) => api.put(`/cakes/${id}`, data)
export const deleteCake = (id) => api.delete(`/cakes/${id}`)
export const searchCakes = (name) => api.get(`/cakes/search?name=${name}`)
