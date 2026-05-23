const { ItemStatus } = require("../constants/itemStatus");

class OrderItem {
  constructor({ id, orderId, productId, quantity, notes, status, createdAt, updatedAt }) {
    this.id = id;
    this.orderId = orderId;
    this.productId = productId;
    this.quantity = quantity;
    this.notes = notes;
    this.status = status;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  static create({ productId, quantity, notes }) {
    if (!productId) {
      const error = new Error("productId is required for each item");
      error.status = 400;
      throw error;
    }

    const qty = quantity !== undefined ? Number(quantity) : 1;
    if (!Number.isInteger(qty) || qty < 1) {
      const error = new Error("Item quantity must be a positive integer");
      error.status = 400;
      throw error;
    }

    return new OrderItem({
      productId,
      quantity: qty,
      notes: notes || null,
      status: ItemStatus.PENDENTE
    });
  }

  static validateStatus(status) {
    const allowed = Object.values(ItemStatus);
    if (!allowed.includes(status)) {
      const error = new Error("Invalid item status");
      error.status = 400;
      throw error;
    }
  }
}

module.exports = OrderItem;
