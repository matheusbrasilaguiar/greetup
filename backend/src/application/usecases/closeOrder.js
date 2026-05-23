const { OrderStatus } = require("../../domain/constants/orderStatus");
const { Events } = require("../../domain/constants/events");

async function closeOrder({ id, companyId }, { orderRepository, eventPublisher }) {
  if (!id) {
    const error = new Error("Id is required");
    error.status = 400;
    throw error;
  }

  const order = await orderRepository.getOrderById(id, companyId);

  if (!order) {
    const error = new Error("Order not found");
    error.status = 404;
    throw error;
  }

  if (order.status === OrderStatus.CLOSED) {
    return order;
  }

  const closedOrder = await orderRepository.updateOrderStatus(id, OrderStatus.CLOSED);

  await eventPublisher.publish(Events.ORDER_CLOSED, {
    orderId: closedOrder.id,
    tableId: closedOrder.tableId,
    tableCode: closedOrder.table.code,
    status: closedOrder.status,
    closedAt: closedOrder.updatedAt
  });

  return closedOrder;
}

module.exports = closeOrder;
