const express = require('express');
const router = express.Router();
const orderController = require('../controller/order.controller');
const verifyToken = require('../middlewares/auth.middleware');

// Create a new order
router.post('/', verifyToken, orderController.createOrder);

// Update an existing order
router.put('/:orderId', verifyToken, orderController.updateOrder);

// Get all orders
router.get('/', verifyToken, orderController.getAllOrders);

// Get order by ID
router.get('/:orderId', verifyToken, orderController.getOrderById);

// Get orders by created by
router.get('/created-by/:createdBy', verifyToken, orderController.getOrdersByCreatedBy);

// Get orders by retailer ID
router.get('/retailer/:retailerId', verifyToken, orderController.getOrdersByRetailerId);

// Get orders by RDC ID
router.get('/rdc/:rdcId', verifyToken, orderController.getOrdersByRDCId);

module.exports = router;