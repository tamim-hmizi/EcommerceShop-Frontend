import api from './api';

// Create a new order
export const createOrder = async (orderData, token) => {
  const res = await api.post('/orders', orderData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

// Get orders for the logged-in user
export const getUserOrders = async (token) => {
  const res = await api.get('/orders', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

// Get all orders (admin only)
export const getAllOrders = async (token) => {
  const res = await api.get('/orders/all', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

// Update order status and/or payment (admin only)
export const updateOrderStatusAndPayment = async (_id, updateData, token) => {
  const res = await api.put(`/orders/${_id}`, updateData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};
