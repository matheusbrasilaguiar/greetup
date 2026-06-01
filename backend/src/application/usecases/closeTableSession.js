const { TableStatus } = require("../../domain/constants/tableStatus");
const { OrderStatus } = require("../../domain/constants/orderStatus");
const { Events } = require("../../domain/constants/events");

async function closeTableSession(
  { sessionId, companyId },
  { tableSessionRepository, tableRepository, eventPublisher }
) {
  if (!sessionId) {
    const error = new Error("sessionId is required");
    error.status = 400;
    throw error;
  }

  const session = await tableSessionRepository.getSessionById(sessionId, companyId);
  if (!session) {
    const error = new Error("Session not found");
    error.status = 404;
    throw error;
  }

  if (session.closedAt !== null) {
    const error = new Error("Session is already closed");
    error.status = 400;
    throw error;
  }

  const openOrders = (session.orders || []).filter(o => o.status === OrderStatus.OPEN);
  if (openOrders.length > 0) {
    const error = new Error(
      `Cannot close session with ${openOrders.length} open order(s). Close all orders first.`
    );
    error.status = 409;
    throw error;
  }

  const closedSession = await tableSessionRepository.closeSession(sessionId);

  await tableRepository.updateStatus(session.tableId, TableStatus.OPEN, companyId);

  await eventPublisher.publish(Events.TABLE_SESSION_CLOSED, {
    sessionId: closedSession.id,
    tableId: closedSession.tableId,
    tableCode: closedSession.table.code,
    companyId: closedSession.companyId,
    openedAt: closedSession.openedAt,
    closedAt: closedSession.closedAt
  });

  return closedSession;
}

module.exports = closeTableSession;
