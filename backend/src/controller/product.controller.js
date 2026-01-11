const productService = require("../services/product.service");

const getAllProducts = async (req, res) => {
  try {
    const products = await productService.getAllProducts();
    
    res.json({
      message: "Products retrieved successfully",
      products
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to retrieve products" });
  }
};

const getProductById = async (req, res) => {
  try {
    const { productId } = req.params;
    const product = await productService.getProductById(productId);
    
    res.json({
      message: "Product retrieved successfully",
      product
    });

  } catch (error) {
    console.error(error);
    
    if (error.message === "Product not found") {
      return res.status(404).json({ message: error.message });
    }
    
    res.status(500).json({ message: "Failed to retrieve product" });
  }
};

const addProduct = async (req, res) => {
  try {
    const productId = await productService.addProduct(req.body);
    
    res.status(201).json({
      message: "Product created successfully",
      productId
    });

  } catch (error) {
    console.error(error);
    
    if (error.message.includes("required")) {
      return res.status(400).json({ message: error.message });
    }
    
    res.status(500).json({ message: "Product creation failed" });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    
    await productService.updateProduct(productId, req.body);
    
    res.json({
      message: "Product updated successfully"
    });

  } catch (error) {
    console.error(error);
    
    if (error.message === "Product not found") {
      return res.status(404).json({ message: error.message });
    }
    
    if (error.message.includes("required")) {
      return res.status(400).json({ message: error.message });
    }
    
    res.status(500).json({ message: "Product update failed" });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    
    await productService.deleteProduct(productId);
    
    res.json({
      message: "Product deleted successfully"
    });

  } catch (error) {
    console.error(error);
    
    if (error.message === "Product not found") {
      return res.status(404).json({ message: error.message });
    }
    
    res.status(500).json({ message: "Product deletion failed" });
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  addProduct,
  updateProduct,
  deleteProduct
};