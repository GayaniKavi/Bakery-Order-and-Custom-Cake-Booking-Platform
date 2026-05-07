import api from './api'

export const placeOrder = (data) => api.post('/orders', data)
export const getAllOrders = () => api.get('/orders')
export const getOrderById = (id) => api.get(`/orders/${id}`)
export const getOrdersByCustomer = (customerId) => api.get(`/orders/customer/${customerId}`)
export const updateOrder = (id, data) => api.put(`/orders/${id}`, data)
export const updateOrderStatus = (id, status) => api.put(`/orders/${id}/status`, { status })
export const cancelOrder = (id) => api.delete(`/orders/${id}`)
