class OrderRepository {
  async createOrder(orderData, itemsData) {
    throw new Error("OrderRepository#createOrder not implemented");
  }

  async getOrderById(id, companyId) {
    throw new Error("OrderRepository#getOrderById not implemented");
  }

  async listOrders(filters) {
    throw new Error("OrderRepository#listOrders not implemented");
  }

  async updateItemStatus(itemId, status, companyId) {
    throw new Error("OrderRepository#updateItemStatus not implemented");
  }

  async updateOrderStatus(id, status) {
    throw new Error("OrderRepository#updateOrderStatus not implemented");
  }
}

module.exports = OrderRepository;
