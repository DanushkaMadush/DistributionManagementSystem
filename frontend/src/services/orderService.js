import axiosInstance from './axiosInstance';

const orderService = {
  createOrder: async (orderData) => {
    try {
      const response = await axiosInstance.post('/orders', orderData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  updateOrder: async (orderId, orderData) => {
    try {
      const response = await axiosInstance.put(`/orders/${orderId}`, orderData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getAllOrders: async () => {
    try {
      const response = await axiosInstance.get('/orders');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getOrderById: async (orderId) => {
    try {
      const response = await axiosInstance.get(`/orders/${orderId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getOrdersByCreatedBy: async (createdBy) => {
    try {
      const response = await axiosInstance.get(`/orders/created-by/${createdBy}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getOrdersByRetailerId: async (retailerId) => {
    try {
      const response = await axiosInstance.get(`/orders/retailer/${retailerId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getOrdersByRDCId: async (rdcId) => {
    try {
      const response = await axiosInstance.get(`/orders/rdc/${rdcId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

export default orderService;