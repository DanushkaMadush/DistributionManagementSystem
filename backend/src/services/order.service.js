const orderRepository = require("../repositories/order.repository");

const createOrder = async (data, user) => {
  return await orderRepository.createOrder(data, user.employeeId);
};

const updateOrder = async (orderId, data, user) => {
  return await orderRepository.updateOrder(orderId, data, user.employeeId);
};

const getAllOrders = async () => {
  return await orderRepository.getAllOrders();
};

const getOrderById = async (orderId) => {
  const order = await orderRepository.getOrderById(orderId);

  if (!order) {
    throw new Error("Order not found");
  }

  return order;
};

const getOrdersByCreatedBy = async (createdBy) => {
  return await orderRepository.getOrdersByCreatedBy(createdBy);
};

const getOrdersByRetailerId = async (retailerId) => {
  return await orderRepository.getOrdersByRetailerId(retailerId);
};

const getOrdersByRDCId = async (rdcId) => {
  return await orderRepository.getOrdersByRDCId(rdcId);
};

module.exports = {
  createOrder,
  updateOrder,
  getAllOrders,
  getOrderById,
  getOrdersByCreatedBy,
  getOrdersByRetailerId,
  getOrdersByRDCId,
};
