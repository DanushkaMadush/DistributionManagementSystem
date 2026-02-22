const express = require('express');
const router = express.Router();
const productController = require('../controller/product.controller');
const verifyToken = require('../middlewares/auth.middleware');

router.get('/', verifyToken, productController.getAllProducts);

router.get('/:productId', verifyToken, productController.getProductById);

router.post('/', verifyToken, productController.addProduct);

router.put('/:productId', verifyToken, productController.updateProduct);

router.delete('/:productId', verifyToken, productController.deleteProduct);

module.exports = router;