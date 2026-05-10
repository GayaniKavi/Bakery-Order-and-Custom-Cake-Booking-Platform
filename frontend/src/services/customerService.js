import api from './api'

export const registerCustomer = (data) => api.post('/customers', data)
export const loginCustomer = (email, password) => api.post('/customers/login', { email, password })
export const getAllCustomers = () => api.get('/customers')
export const getCustomerById = (id) => api.get(`/customers/${id}`)
export const updateCustomer = (id, data) => api.put(`/customers/${id}`, data)
export const deleteCustomer = (id) => api.delete(`/customers/${id}`)
