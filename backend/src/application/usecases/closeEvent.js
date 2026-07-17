const { TableStatus } = require("../../domain/constants/tableStatus");
const { EventStatus } = require("../../domain/constants/eventStatus");

async function closeEvent(
  { id, companyId },
  { eventRepository, tableSessionRepository, tableRepository }
) {
  const event = await eventRepository.getEventById(id, companyId);
  if (!event) {
    const error = new Error("Event not found");
    error.status = 404;
    throw error;
  }
  if (event.status === EventStatus.CLOSED) {
    const error = new Error("Event is already closed");
    error.status = 400;
    throw error;
  }

  const closedSessions = await tableSessionRepository.closeEventSessions(id, companyId);

  const uniqueTableIds = [...new Set(closedSessions.map((s) => s.tableId))];
  for (const tableId of uniqueTableIds) {
    await tableRepository.updateStatus(tableId, TableStatus.OPEN, companyId);
  }

  return eventRepository.updateEventStatus(id, EventStatus.CLOSED);
}

module.exports = closeEvent;
