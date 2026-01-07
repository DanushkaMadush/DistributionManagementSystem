const { getPool, sql } = require('../config/db');

const createOrder = async (order, createdBy) => {
  const pool = await getPool(process.env.CENTRAL_DB);
  const transaction = new sql.Transaction(pool);

  try {
    await transaction.begin();

    const orderResult = await transaction.request()
      .input('RetailerId', sql.Int, order.retailerId)
      .input('RDCId', sql.Int, order.regionalDistributionCenterId)
      .input('EstimatedDeliveryDate', sql.DateTime, order.estimatedDeliveryDate)
      .input('OrderStatus', sql.NVarChar, order.orderStatus)
      .input('CreatedBy', sql.NVarChar, createdBy)
      .query(`
        INSERT INTO [Order]
        (RetailerId, RegionalDistributionCenterId, EstimatedDeliveryDate, OrderStatus, CreatedBy)
        OUTPUT INSERTED.OrderId
        VALUES (@RetailerId, @RDCId, @EstimatedDeliveryDate, @OrderStatus, @CreatedBy)
      `);

    const orderId = orderResult.recordset[0].OrderId;

    for (const item of order.items) {
      const total = item.quantity * item.unitPrice;

      await transaction.request()
        .input('OrderId', sql.Int, orderId)
        .input('ProductId', sql.Int, item.productId)
        .input('Quantity', sql.Decimal(18,2), item.quantity)
        .input('UnitPrice', sql.Decimal(18,2), item.unitPrice)
        .input('Total', sql.Decimal(18,2), total)
        .query(`
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
  const pool = await getPool(process.env.CENTRAL_DB);
  const transaction = new sql.Transaction(pool);

  try {
    await transaction.begin();

    const check = await transaction.request()
      .input('OrderId', sql.Int, orderId)
      .query(`SELECT OrderId FROM [Order] WHERE OrderId = @OrderId`);

    if (!check.recordset.length) {
      throw new Error('Order not found');
    }

    await transaction.request()
      .input('OrderId', sql.Int, orderId)
      .input('RetailerId', sql.Int, order.retailerId)
      .input('RDCId', sql.Int, order.regionalDistributionCenterId)
      .input('EstimatedDeliveryDate', sql.DateTime, order.estimatedDeliveryDate)
      .input('OrderStatus', sql.NVarChar, order.orderStatus)
      .input('UpdatedBy', sql.NVarChar, updatedBy)
      .query(`
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

    await transaction.request()
      .input('OrderId', sql.Int, orderId)
      .query(`DELETE FROM OrderItem WHERE OrderId = @OrderId`);

    for (const item of order.items) {
      const total = item.quantity * item.unitPrice;

      await transaction.request()
        .input('OrderId', sql.Int, orderId)
        .input('ProductId', sql.Int, item.productId)
        .input('Quantity', sql.Decimal(18,2), item.quantity)
        .input('UnitPrice', sql.Decimal(18,2), item.unitPrice)
        .input('Total', sql.Decimal(18,2), total)
        .query(`
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

module.exports = {
  createOrder , updateOrder
};