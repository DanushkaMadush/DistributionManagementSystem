const { connectDB, sql } = require("../config/db");

const createOrder = async (order, createdBy) => {
  const pool = await connectDB();
  const transaction = new sql.Transaction(pool);

  try {
    await transaction.begin();

    const orderResult = await transaction
      .request()
      .input("RetailerId", sql.Int, order.retailerId)
      .input("RDCId", sql.Int, order.regionalDistributionCenterId)
      .input("EstimatedDeliveryDate", sql.DateTime, order.estimatedDeliveryDate)
      .input("OrderStatus", sql.NVarChar, order.orderStatus)
      .input("CreatedBy", sql.NVarChar, createdBy).query(`
        INSERT INTO [Order]
        (RetailerId, RegionalDistributionCenterId, EstimatedDeliveryDate, OrderStatus, CreatedBy)
        OUTPUT INSERTED.OrderId
        VALUES (@RetailerId, @RDCId, @EstimatedDeliveryDate, @OrderStatus, @CreatedBy)
      `);

    const orderId = orderResult.recordset[0].OrderId;

    for (const item of order.items) {
      const total = item.quantity * item.unitPrice;

      await transaction
        .request()
        .input("OrderId", sql.Int, orderId)
        .input("ProductId", sql.Int, item.productId)
        .input("Quantity", sql.Decimal(18, 2), item.quantity)
        .input("UnitPrice", sql.Decimal(18, 2), item.unitPrice)
        .input("Total", sql.Decimal(18, 2), total).query(`
          INSERT INTO OrderItem
          (OrderId, ProductId, Quantity, UnitPrice, Total)
          VALUES (@OrderId, @ProductId, @Quantity, @UnitPrice, @Total)
        `);
    }

    await transaction.commit();
    return orderId;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

const updateOrder = async (orderId, order, updatedBy) => {
  const pool = await await connectDB();
  const transaction = new sql.Transaction(pool);

  try {
    await transaction.begin();

    const check = await transaction
      .request()
      .input("OrderId", sql.Int, orderId)
      .query(`SELECT OrderId FROM [Order] WHERE OrderId = @OrderId`);

    if (!check.recordset.length) {
      throw new Error("Order not found");
    }

    await transaction
      .request()
      .input("OrderId", sql.Int, orderId)
      .input("RetailerId", sql.Int, order.retailerId)
      .input("RDCId", sql.Int, order.regionalDistributionCenterId)
      .input("EstimatedDeliveryDate", sql.DateTime, order.estimatedDeliveryDate)
      .input("OrderStatus", sql.NVarChar, order.orderStatus)
      .input("UpdatedBy", sql.NVarChar, updatedBy).query(`
        UPDATE [Order]
        SET
          RetailerId = @RetailerId,
          RegionalDistributionCenterId = @RDCId,
          EstimatedDeliveryDate = @EstimatedDeliveryDate,
          OrderStatus = @OrderStatus,
          UpdatedDate = GETDATE(),
          UpdatedBy = @UpdatedBy
        WHERE OrderId = @OrderId
      `);

    await transaction
      .request()
      .input("OrderId", sql.Int, orderId)
      .query(`DELETE FROM OrderItem WHERE OrderId = @OrderId`);

    for (const item of order.items) {
      const total = item.quantity * item.unitPrice;

      await transaction
        .request()
        .input("OrderId", sql.Int, orderId)
        .input("ProductId", sql.Int, item.productId)
        .input("Quantity", sql.Decimal(18, 2), item.quantity)
        .input("UnitPrice", sql.Decimal(18, 2), item.unitPrice)
        .input("Total", sql.Decimal(18, 2), total).query(`
          INSERT INTO OrderItem
          (OrderId, ProductId, Quantity, UnitPrice, Total)
          VALUES (@OrderId, @ProductId, @Quantity, @UnitPrice, @Total)
        `);
    }

    await transaction.commit();
    return true;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

const getAllOrders = async () => {
  const pool = await await connectDB();

  try {
    const result = await pool.request().query(`
        SELECT 
          o.OrderId,
          o.RetailerId,
          o.RegionalDistributionCenterId,
          o.EstimatedDeliveryDate,
          o.OrderStatus,
          o.CreatedDate,
          o.CreatedBy,
          o.UpdatedDate,
          o.UpdatedBy
        FROM dbo.[Order] o
        ORDER BY o.CreatedDate DESC
      `);

    const orders = result.recordset;

    for (const order of orders) {
      const itemsResult = await pool
        .request()
        .input("OrderId", sql.Int, order.OrderId).query(`
          SELECT 
            OrderItemId,
            ProductId,
            Quantity,
            UnitPrice,
            Total
          FROM OrderItem
          WHERE OrderId = @OrderId
        `);

      order.items = itemsResult.recordset;
    }

    return orders;
  } catch (error) {
    throw error;
  }
};

const getOrderById = async (orderId) => {
  const pool = await await connectDB();

  try {
    const result = await pool.request().input("OrderId", sql.Int, orderId)
      .query(`
        SELECT 
          o.OrderId,
          o.RetailerId,
          o.RegionalDistributionCenterId,
          o.EstimatedDeliveryDate,
          o.OrderStatus,
          o.CreatedDate,
          o.CreatedBy,
          o.UpdatedDate,
          o.UpdatedBy
        FROM [Order] o
        WHERE o.OrderId = @OrderId
      `);

    if (!result.recordset.length) {
      return null;
    }

    const order = result.recordset[0];

    const itemsResult = await pool.request().input("OrderId", sql.Int, orderId)
      .query(`
        SELECT 
          OrderItemId,
          ProductId,
          Quantity,
          UnitPrice,
          Total
        FROM OrderItem
        WHERE OrderId = @OrderId
      `);

    order.items = itemsResult.recordset;

    return order;
  } catch (error) {
    throw error;
  }
};

const getOrdersByCreatedBy = async (createdBy) => {
  const pool = await await connectDB();

  try {
    const result = await pool
      .request()
      .input("CreatedBy", sql.NVarChar, createdBy).query(`
        SELECT 
          o.OrderId,
          o.RetailerId,
          o.RegionalDistributionCenterId,
          o.EstimatedDeliveryDate,
          o.OrderStatus,
          o.CreatedDate,
          o.CreatedBy,
          o.UpdatedDate,
          o.UpdatedBy
        FROM [Order] o
        WHERE o.CreatedBy = @CreatedBy
        ORDER BY o.CreatedDate DESC
      `);

    const orders = result.recordset;

    for (const order of orders) {
      const itemsResult = await pool
        .request()
        .input("OrderId", sql.Int, order.OrderId).query(`
          SELECT 
            OrderItemId,
            ProductId,
            Quantity,
            UnitPrice,
            Total
          FROM OrderItem
          WHERE OrderId = @OrderId
        `);

      order.items = itemsResult.recordset;
    }

    return orders;
  } catch (error) {
    throw error;
  }
};

const getOrdersByRetailerId = async (retailerId) => {
  const pool = await await connectDB();

  try {
    const result = await pool.request().input("RetailerId", sql.Int, retailerId)
      .query(`
        SELECT 
          o.OrderId,
          o.RetailerId,
          o.RegionalDistributionCenterId,
          o.EstimatedDeliveryDate,
          o.OrderStatus,
          o.CreatedDate,
          o.CreatedBy,
          o.UpdatedDate,
          o.UpdatedBy
        FROM [Order] o
        WHERE o.RetailerId = @RetailerId
        ORDER BY o.CreatedDate DESC
      `);

    const orders = result.recordset;

    for (const order of orders) {
      const itemsResult = await pool
        .request()
        .input("OrderId", sql.Int, order.OrderId).query(`
          SELECT 
            OrderItemId,
            ProductId,
            Quantity,
            UnitPrice,
            Total
          FROM OrderItem
          WHERE OrderId = @OrderId
        `);

      order.items = itemsResult.recordset;
    }

    return orders;
  } catch (error) {
    throw error;
  }
};

const getOrdersByRDCId = async (rdcId) => {
  const pool = await await connectDB();

  try {
    const result = await pool.request().input("RDCId", sql.Int, rdcId).query(`
        SELECT 
          o.OrderId,
          o.RetailerId,
          o.RegionalDistributionCenterId,
          o.EstimatedDeliveryDate,
          o.OrderStatus,
          o.CreatedDate,
          o.CreatedBy,
          o.UpdatedDate,
          o.UpdatedBy
        FROM [Order] o
        WHERE o.RegionalDistributionCenterId = @RDCId
        ORDER BY o.CreatedDate DESC
      `);

    const orders = result.recordset;

    for (const order of orders) {
      const itemsResult = await pool
        .request()
        .input("OrderId", sql.Int, order.OrderId).query(`
          SELECT 
            OrderItemId,
            ProductId,
            Quantity,
            UnitPrice,
            Total
          FROM OrderItem
          WHERE OrderId = @OrderId
        `);

      order.items = itemsResult.recordset;
    }

    return orders;
  } catch (error) {
    throw error;
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
