const Order = require("../../domain/entities/Order");

async function listOrders({ sessionId, status, eventId, companyId } = {}, { orderRepository, eventRepository }) {
  if (status !== undefined) {
    Order.validateStatus(status);
  }

  let resolvedEventId = eventId;
  if (eventId === "active" && eventRepository) {
    const active = await eventRepository.getActiveEvent(companyId);
    resolvedEventId = active?.id ?? "__none__";
  }

  return orderRepository.listOrders({ sessionId, status, eventId: resolvedEventId, companyId });
}

module.exports = listOrders;
