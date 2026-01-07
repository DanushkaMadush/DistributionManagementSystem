const orderRepository = require('../repositories/order.repository');

const createOrder = async (data, user) => {
  return await orderRepository.createOrder(data, user.employeeId);
};

const updateOrder = async (orderId, data, user) => {
  return await orderRepository.updateOrder(
    orderId,
    data,
    user.employeeId
  );
};

module.exports = {
  createOrder , updateOrder
};
