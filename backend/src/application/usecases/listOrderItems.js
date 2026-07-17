async function listOrderItems({ companyId, status, eventId }, { orderRepository, eventRepository }) {
  let resolvedEventId = eventId;
  if (eventId === "active" && eventRepository) {
    const active = await eventRepository.getActiveEvent(companyId);
    resolvedEventId = active?.id ?? "__none__";
  }

  return orderRepository.listItems({ companyId, status, eventId: resolvedEventId });
}

module.exports = listOrderItems;
