const OrderItem = require("../../domain/entities/OrderItem");
const { Events } = require("../../domain/constants/events");

async function updateItemStatus(
  { orderId, itemId, status, companyId },
  { orderRepository, eventPublisher }
) {
  if (!orderId || !itemId) {
    const error = new Error("orderId and itemId are required");
    error.status = 400;
    throw error;
  }

  OrderItem.validateStatus(status);

  const item = await orderRepository.updateItemStatus(itemId, status, companyId);

  await eventPublisher.publish(Events.ORDER_ITEM_STATUS_CHANGED, {
    orderId,
    sessionId: item.order.sessionId,
    itemId: item.id,
    productId: item.productId,
    productName: item.product.name,
    productCategory: item.product.category,
    status: item.status,
    companyId: item.order.companyId,
    updatedAt: item.updatedAt
  });

  return item;
}

module.exports = updateItemStatus;
