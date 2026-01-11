const { getPool, sql } = require("../config/db");

const getAllProducts = async () => {
  const pool = await getPool(process.env.CENTRAL_DB);

  try {
    const result = await pool.request().query(`
        SELECT 
          ProductId,
          ProductName,
          unitPrice,
          unitOfMeasure
        FROM Product
        ORDER BY ProductName ASC
      `);

    return result.recordset;
  } catch (error) {
    throw error;
  }
};

const getProductById = async (productId) => {
  const pool = await getPool(process.env.CENTRAL_DB);

  try {
    const result = await pool.request().input("ProductId", sql.Int, productId)
      .query(`
        SELECT 
          ProductId,
          ProductName,
          unitPrice,
          unitOfMeasure
        FROM Product
        WHERE ProductId = @ProductId
      `);

    return result.recordset[0] || null;
  } catch (error) {
    throw error;
  }
};

const addProduct = async (product) => {
  const pool = await getPool(process.env.CENTRAL_DB);

  try {
    const result = await pool
      .request()
      .input("ProductName", sql.NVarChar(50), product.productName)
      .input("unitPrice", sql.Decimal(18, 2), product.unitPrice)
      .input("unitOfMeasure", sql.NVarChar(50), product.unitOfMeasure).query(`
        INSERT INTO Product (ProductName, unitPrice, unitOfMeasure)
        VALUES (@ProductName, @unitPrice, @unitOfMeasure);
        SELECT SCOPE_IDENTITY() AS ProductId;
      `);

    return result.recordset[0].ProductId;
  } catch (error) {
    throw error;
  }
};

const updateProductById = async (productId, product) => {
  const pool = await getPool(process.env.CENTRAL_DB);

  try {
    const result = await pool
      .request()
      .input("ProductId", sql.Int, productId)
      .input("ProductName", sql.NVarChar(50), product.productName)
      .input("unitPrice", sql.Decimal(18, 2), product.unitPrice)
      .input("unitOfMeasure", sql.NVarChar(50), product.unitOfMeasure).query(`
        UPDATE Product
        SET 
          ProductName = @ProductName,
          unitPrice = @unitPrice,
          unitOfMeasure = @unitOfMeasure
        WHERE ProductId = @ProductId
      `);

    return result.rowsAffected[0] > 0;
  } catch (error) {
    throw error;
  }
};

const deleteProduct = async (productId) => {
  const pool = await getPool(process.env.CENTRAL_DB);

  try {
    const result = await pool.request().input("ProductId", sql.Int, productId)
      .query(`
        DELETE FROM Product
        WHERE ProductId = @ProductId
      `);

    return result.rowsAffected[0] > 0;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  addProduct,
  updateProductById,
  deleteProduct,
};