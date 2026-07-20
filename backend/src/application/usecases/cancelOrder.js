const { OrderStatus } = require("../../domain/constants/orderStatus");
const { Events } = require("../../domain/constants/events");

async function cancelOrder({ id, companyId }, { orderRepository, eventPublisher }) {
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

  if (order.status === OrderStatus.CANCELED) {
    return order;
  }

  if (order.status === OrderStatus.CLOSED) {
    const error = new Error("Cannot cancel a closed order");
    error.status = 400;
    throw error;
  }

  const canceledOrder = await orderRepository.updateOrderStatus(id, OrderStatus.CANCELED);

  await eventPublisher.publish(Events.ORDER_CANCELED, {
    orderId: canceledOrder.id,
    sessionId: canceledOrder.sessionId,
    tableId: canceledOrder.session.tableId,
    tableCode: canceledOrder.session.table.code,
    companyId: canceledOrder.companyId,
    status: canceledOrder.status,
  });

  return canceledOrder;
}

module.exports = cancelOrder;
