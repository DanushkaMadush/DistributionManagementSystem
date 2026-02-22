const orderService = require("../services/order.service");

const createOrder = async (req, res) => {
  try {
    const orderId = await orderService.createOrder(req.body, req.user);

    res.status(201).json({
      message: "Order created successfully",
      orderId,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Order creation failed" });
  }
};

const updateOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    await orderService.updateOrder(orderId, req.body, req.user);

    res.json({
      message: "Order updated successfully",
    });
  } catch (error) {
    console.error(error);

    if (error.message === "Order not found") {
      return res.status(404).json({ message: error.message });
    }

    res.status(500).json({ message: "Order update failed" });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const orders = await orderService.getAllOrders();

    res.json({
      message: "Orders retrieved successfully",
      orders,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to retrieve orders" });
  }
};

const getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await orderService.getOrderById(orderId);

    res.json({
      message: "Order retrieved successfully",
      order,
    });
  } catch (error) {
    console.error(error);

    if (error.message === "Order not found") {
      return res.status(404).json({ message: error.message });
    }

    res.status(500).json({ message: "Failed to retrieve order" });
  }
};

const getOrdersByCreatedBy = async (req, res) => {
  try {
    const { createdBy } = req.params;

    const orders = await orderService.getOrdersByCreatedBy(createdBy);

    res.json({
      message: "Orders retrieved successfully",
      orders,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to retrieve orders" });
  }
};

const getOrdersByRetailerId = async (req, res) => {
  try {
    const { retailerId } = req.params;

    const orders = await orderService.getOrdersByRetailerId(retailerId);

    res.json({
      message: "Orders retrieved successfully",
      orders,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to retrieve orders" });
  }
};

const getOrdersByRDCId = async (req, res) => {
  try {
    const { rdcId } = req.params;

    const orders = await orderService.getOrdersByRDCId(rdcId);

    res.json({
      message: "Orders retrieved successfully",
      orders,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to retrieve orders" });
  }
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