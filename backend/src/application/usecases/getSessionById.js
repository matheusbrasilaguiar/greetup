async function getSessionById({ sessionId, companyId }, { tableSessionRepository }) {
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

  const durationMinutes = session.closedAt
    ? Math.floor((new Date(session.closedAt) - new Date(session.openedAt)) / 60000)
    : Math.floor((Date.now() - new Date(session.openedAt).getTime()) / 60000);

  return { ...session, durationMinutes };
}

module.exports = getSessionById;
