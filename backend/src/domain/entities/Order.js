const { OrderStatus } = require("../constants/orderStatus");

class Order {
  constructor({ id, sessionId, status, toGo, items, createdAt, updatedAt }) {
    this.id = id;
    this.sessionId = sessionId;
    this.status = status;
    this.toGo = toGo ?? false;
    this.items = items;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  static create({ sessionId, items, toGo = false }) {
    if (!sessionId) {
      const error = new Error("sessionId is required");
      error.status = 400;
      throw error;
    }

    if (!items || items.length === 0) {
      const error = new Error("Order must have at least one item");
      error.status = 400;
      throw error;
    }

    return new Order({
      sessionId,
      status: OrderStatus.OPEN,
      toGo: Boolean(toGo),
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
