const Order = require("../../domain/entities/Order");
const OrderItem = require("../../domain/entities/OrderItem");
const { OrderStatus } = require("../../domain/constants/orderStatus");
const { Events } = require("../../domain/constants/events");

async function createOrder(
  { sessionId, items, toGo = false, companyId },
  { orderRepository, tableSessionRepository, eventPublisher }
) {
  const session = await tableSessionRepository.getSessionById(sessionId, companyId);
  if (!session) {
    const error = new Error("Session not found");
    error.status = 404;
    throw error;
  }

  if (session.closedAt !== null) {
    const error = new Error("Cannot create order for a closed session");
    error.status = 400;
    throw error;
  }

  const orderEntity = Order.create({ sessionId, items, toGo });

  const itemEntities = orderEntity.items.map(item =>
    OrderItem.create({
      productId: item.productId,
      quantity: item.quantity,
      notes: item.notes,
      withCheese: item.withCheese,
      courtesy: item.courtesy
    })
  );

  const order = await orderRepository.createOrder(
    { sessionId: orderEntity.sessionId, status: orderEntity.status, toGo: orderEntity.toGo, companyId },
    itemEntities.map(item => ({
      productId: item.productId,
      quantity: item.quantity,
      notes: item.notes,
      withCheese: item.withCheese,
      courtesy: item.courtesy,
      status: item.status
    }))
  );

  await eventPublisher.publish(Events.ORDER_CREATED, {
    orderId: order.id,
    sessionId: order.sessionId,
    tableId: order.session.tableId,
    tableCode: order.session.table.code,
    customerId: order.session.customerId,
    companyId: order.companyId,
    status: order.status,
    items: order.items.map(item => ({
      id: item.id,
      productId: item.productId,
      productName: item.product.name,
      productCategory: item.product.category,
      quantity: item.quantity,
      notes: item.notes,
      status: item.status
    })),
    createdAt: order.createdAt
  });

  return order;
}

module.exports = createOrder;
