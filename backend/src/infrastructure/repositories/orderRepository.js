const OrderRepositoryPort = require("../../application/ports/OrderRepository");
const prisma = require("../database/prisma");

const SESSION_CONTEXT = {
  select: {
    id: true,
    tableId: true,
    customerId: true,
    companyId: true,
    table: { select: { id: true, code: true } },
    customer: { select: { id: true, name: true } },
    attendant: { select: { id: true, name: true } }
  }
};

const ORDER_INCLUDE = {
  session: SESSION_CONTEXT,
  items: {
    include: { product: true },
    orderBy: { createdAt: "asc" }
  }
};

class OrderRepository extends OrderRepositoryPort {
  async createOrder(orderData, itemsData) {
    return prisma.order.create({
      data: {
        ...orderData,
        items: { create: itemsData }
      },
      include: ORDER_INCLUDE
    });
  }

  async getOrderById(id, companyId) {
    return prisma.order.findFirst({
      where: { id, companyId },
      include: ORDER_INCLUDE
    });
  }

  async listOrders(filters = {}) {
    const where = {};
    if (filters.companyId) where.companyId = filters.companyId;
    if (filters.sessionId) where.sessionId = filters.sessionId;
    if (filters.status) where.status = filters.status;
    if (filters.eventId) where.session = { eventId: filters.eventId };

    return prisma.order.findMany({
      where,
      include: ORDER_INCLUDE,
      orderBy: { createdAt: "desc" }
    });
  }

  async updateItemStatus(itemId, status, companyId) {
    return prisma.orderItem.update({
      where: { id: itemId },
      data: { status },
      include: {
        product: true,
        order: { select: { id: true, sessionId: true, companyId: true } }
      }
    });
  }

  async updateOrderStatus(id, status) {
    return prisma.order.update({
      where: { id },
      data: { status },
      include: ORDER_INCLUDE
    });
  }

  async listItems({ companyId, status, eventId }) {
    const orderFilter = { companyId, status: "OPEN" };
    if (eventId) orderFilter.session = { eventId };
    const where = { order: orderFilter };
    if (status) where.status = status;

    return prisma.orderItem.findMany({
      where,
      include: {
        product: true,
        order: {
          include: {
            session: {
              include: {
                table:    { select: { id: true, code: true } },
                customer: { select: { id: true, name: true } },
                attendant: { select: { id: true, name: true } }
              }
            }
          }
        }
      },
      orderBy: { createdAt: "asc" }
    });
  }
}

module.exports = new OrderRepository();
