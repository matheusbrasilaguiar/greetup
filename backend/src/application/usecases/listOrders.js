const Order = require("../../domain/entities/Order");

async function listOrders({ sessionId, status, companyId } = {}, { orderRepository }) {
  if (status !== undefined) {
    Order.validateStatus(status);
  }

  return orderRepository.listOrders({ sessionId, status, companyId });
}

module.exports = listOrders;
