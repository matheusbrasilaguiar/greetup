const { TableStatus } = require("../../domain/constants/tableStatus");
const { EventStatus } = require("../../domain/constants/eventStatus");
const closeEvent = require("./closeEvent");

async function activateEvent(
  { id, companyId },
  { eventRepository, tableSessionRepository, tableRepository }
) {
  const event = await eventRepository.getEventById(id, companyId);
  if (!event) {
    const error = new Error("Event not found");
    error.status = 404;
    throw error;
  }
  if (event.status === EventStatus.ACTIVE) {
    const error = new Error("Event is already active");
    error.status = 400;
    throw error;
  }

  const deps = { eventRepository, tableSessionRepository, tableRepository };

  // Close any currently active event first
  const currentActive = await eventRepository.getActiveEvent(companyId);
  if (currentActive && currentActive.id !== id) {
    await closeEvent({ id: currentActive.id, companyId }, deps);
  }

  // Close orphan sessions (created before the Event concept existed)
  const orphans = await tableSessionRepository.closeOrphanSessions(companyId);
  const orphanTableIds = [...new Set(orphans.map((s) => s.tableId))];
  for (const tableId of orphanTableIds) {
    await tableRepository.updateStatus(tableId, TableStatus.OPEN, companyId);
  }

  return eventRepository.updateEventStatus(id, EventStatus.ACTIVE);
}

module.exports = activateEvent;
