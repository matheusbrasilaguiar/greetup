async function getActiveSession({ tableId, companyId }, { tableSessionRepository }) {
  if (!tableId) {
    const error = new Error("tableId is required");
    error.status = 400;
    throw error;
  }

  const session = await tableSessionRepository.getActiveSessionByTable(tableId, companyId);

  if (!session) {
    const error = new Error("No active session for this table");
    error.status = 404;
    throw error;
  }

  const durationMinutes = Math.floor(
    (Date.now() - new Date(session.openedAt).getTime()) / 60000
  );

  return { ...session, durationMinutes };
}

module.exports = getActiveSession;
