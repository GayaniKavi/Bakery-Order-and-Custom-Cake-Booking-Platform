import api from './api'

export const bookCustomCake = (data) => api.post('/custom-cakes', data)
export const getAllBookings = () => api.get('/custom-cakes')
export const getBookingById = (id) => api.get(`/custom-cakes/${id}`)
export const getBookingsByCustomer = (customerId) => api.get(`/custom-cakes/customer/${customerId}`)
export const updateBooking = (id, data) => api.put(`/custom-cakes/${id}`, data)
export const updateBookingStatus = (id, status) => api.put(`/custom-cakes/${id}/status`, { status })
export const cancelBooking = (id) => api.delete(`/custom-cakes/${id}`)
