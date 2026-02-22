const productRepository = require("../repositories/product.repository");

const getAllProducts = async () => {
  return await productRepository.getAllProducts();
};

const getProductById = async (productId) => {
  const product = await productRepository.getProductById(productId);

  if (!product) {
    throw new Error("Product not found");
  }

  return product;
};

const addProduct = async (productData) => {
  if (
    !productData.productName ||
    !productData.unitPrice ||
    !productData.unitOfMeasure
  ) {
    throw new Error(
      "Product name, unit price, and unit of measure are required"
    );
  }

  return await productRepository.addProduct(productData);
};

const updateProduct = async (productId, productData) => {
  const product = await productRepository.getProductById(productId);

  if (!product) {
    throw new Error("Product not found");
  }

  if (
    !productData.productName ||
    !productData.unitPrice ||
    !productData.unitOfMeasure
  ) {
    throw new Error(
      "Product name, unit price, and unit of measure are required"
    );
  }

  const updated = await productRepository.updateProductById(
    productId,
    productData
  );

  if (!updated) {
    throw new Error("Failed to update product");
  }

  return updated;
};

const deleteProduct = async (productId) => {
  const product = await productRepository.getProductById(productId);

  if (!product) {
    throw new Error("Product not found");
  }

  return await productRepository.deleteProduct(productId);
};

module.exports = {
  getAllProducts,
  getProductById,
  addProduct,
  updateProduct,
  deleteProduct,
};
