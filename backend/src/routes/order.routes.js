const express = require('express');
const router = express.Router();
const orderController = require('../controller/order.controller');
const verifyToken = require('../middlewares/auth.middleware');

router.post('/', verifyToken, orderController.createOrder);

router.put('/:orderId', verifyToken, orderController.updateOrder);

module.exports = router;