const orderService = require('../services/order.service');

const createOrder = async (req, res) => {
  try {
    const orderId = await orderService.createOrder(req.body, req.user);

    res.status(201).json({
      message: 'Order created successfully',
      orderId
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Order creation failed' });
  }
};

const updateOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    await orderService.updateOrder(orderId, req.body, req.user);

    res.json({
      message: 'Order updated successfully'
    });

  } catch (error) {
    console.error(error);

    if (error.message === 'Order not found') {
      return res.status(404).json({ message: error.message });
    }

    res.status(500).json({ message: 'Order update failed' });
  }
};

module.exports = {
  createOrder , updateOrder
};