const TableSession = require("../../domain/entities/TableSession");
const { TableStatus } = require("../../domain/constants/tableStatus");
const { Events } = require("../../domain/constants/events");

async function openTableSession(
  { tableId, customerId, attendantId, companyId },
  { tableSessionRepository, tableRepository, userRepository, customerRepository, eventPublisher, eventRepository }
) {
  const table = await tableRepository.getTableById(tableId, companyId);
  if (!table) {
    const error = new Error("Table not found");
    error.status = 404;
    throw error;
  }

  if (table.status === TableStatus.CLOSED) {
    const error = new Error("Table is closed and cannot accept sessions");
    error.status = 400;
    throw error;
  }

  const activeSession = await tableSessionRepository.getActiveSessionByTable(tableId, companyId);
  if (activeSession) {
    const error = new Error("Table already has an active session");
    error.status = 400;
    throw error;
  }

  const attendant = await userRepository.getUserById(attendantId, companyId);
  if (!attendant) {
    const error = new Error("Attendant not found");
    error.status = 404;
    throw error;
  }

  if (attendant.role !== "GERENTE" && attendant.role !== "ADMIN") {
    const error = new Error("Attendant must have GERENTE or ADMIN role");
    error.status = 403;
    throw error;
  }

  if (customerId) {
    const customer = await customerRepository.getCustomerById(customerId, companyId);
    if (!customer) {
      const error = new Error("Customer not found");
      error.status = 404;
      throw error;
    }
  }

  const activeEvent = eventRepository
    ? await eventRepository.getActiveEvent(companyId)
    : null;

  if (!activeEvent) {
    const error = new Error("Nenhum evento ativo. Ative um evento antes de abrir sessões.");
    error.status = 409;
    throw error;
  }

  const sessionEntity = TableSession.create({ tableId, customerId, attendantId, companyId });

  const session = await tableSessionRepository.createSession({
    tableId:    sessionEntity.tableId,
    customerId: sessionEntity.customerId,
    attendantId: sessionEntity.attendantId,
    companyId:  sessionEntity.companyId,
    eventId:    activeEvent.id,
  });

  await tableRepository.updateStatus(tableId, TableStatus.OCCUPIED, companyId);

  await eventPublisher.publish(Events.TABLE_SESSION_OPENED, {
    sessionId: session.id,
    tableId: session.tableId,
    tableCode: session.table.code,
    customerId: session.customerId,
    customerName: session.customer?.name || null,
    attendantId: session.attendantId,
    attendantName: session.attendant.name,
    companyId: session.companyId,
    openedAt: session.openedAt
  });

  return session;
}

module.exports = openTableSession;
