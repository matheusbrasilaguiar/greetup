const { OrderStatus } = require("../constants/orderStatus");

class Order {
  constructor({ id, tableId, customerId, status, items, createdAt, updatedAt }) {
    this.id = id;
    this.tableId = tableId;
    this.customerId = customerId;
    this.status = status;
    this.items = items;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  static create({ tableId, customerId, items }) {
    if (!tableId) {
      const error = new Error("tableId is required");
      error.status = 400;
      throw error;
    }

    if (!items || items.length === 0) {
      const error = new Error("Order must have at least one item");
      error.status = 400;
      throw error;
    }

    return new Order({
      tableId,
      customerId: customerId || null,
      status: OrderStatus.OPEN,
      items
    });
  }

  static validateStatus(status) {
    const allowed = Object.values(OrderStatus);
    if (!allowed.includes(status)) {
      const error = new Error("Invalid order status");
      error.status = 400;
      throw error;
    }
  }
}

module.exports = Order;
