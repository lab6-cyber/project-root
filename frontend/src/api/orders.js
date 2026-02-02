import api from './client';

export const createOrder = (data) => api.post('/orders', data);
export const getOrders = (userId, isAdmin = false) =>
    api.get(`/orders?${isAdmin ? 'all=true' : `userId=${userId}`}`);
export const updateOrderStatus = (id, status) => api.patch(`/orders/${id}/status`, { status });