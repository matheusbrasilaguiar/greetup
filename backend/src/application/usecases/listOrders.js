const Order = require("../../domain/entities/Order");

async function listOrders({ tableId, status, companyId } = {}, { orderRepository }) {
  if (status !== undefined) {
    Order.validateStatus(status);
  }

  return orderRepository.listOrders({ tableId, status, companyId });
}

module.exports = listOrders;
