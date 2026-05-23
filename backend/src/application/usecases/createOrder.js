const Order = require("../../domain/entities/Order");
const OrderItem = require("../../domain/entities/OrderItem");
const { Events } = require("../../domain/constants/events");

async function createOrder({ tableId, customerId, items, companyId }, { orderRepository, eventPublisher }) {
  const orderEntity = Order.create({ tableId, customerId, items });

  const itemEntities = orderEntity.items.map(item =>
    OrderItem.create({ productId: item.productId, quantity: item.quantity, notes: item.notes })
  );

  const order = await orderRepository.createOrder(
    {
      tableId: orderEntity.tableId,
      customerId: orderEntity.customerId,
      status: orderEntity.status,
      companyId
    },
    itemEntities.map(item => ({
      productId: item.productId,
      quantity: item.quantity,
      notes: item.notes,
      status: item.status
    }))
  );

  await eventPublisher.publish(Events.ORDER_CREATED, {
    orderId: order.id,
    tableId: order.tableId,
    tableCode: order.table.code,
    companyId: order.companyId,
    customerId: order.customerId,
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
