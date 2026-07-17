class TableSessionRepository {
  async createSession(data) {
    throw new Error("TableSessionRepository#createSession not implemented");
  }

  async getActiveSessionByTable(tableId, companyId) {
    throw new Error("TableSessionRepository#getActiveSessionByTable not implemented");
  }

  async getSessionById(id, companyId) {
    throw new Error("TableSessionRepository#getSessionById not implemented");
  }

  async closeSession(id) {
    throw new Error("TableSessionRepository#closeSession not implemented");
  }

  async listSessions(filters) {
    throw new Error("TableSessionRepository#listSessions not implemented");
  }

  async closeEventSessions(eventId, companyId) {
    throw new Error("TableSessionRepository#closeEventSessions not implemented");
  }

  async closeOrphanSessions(companyId) {
    throw new Error("TableSessionRepository#closeOrphanSessions not implemented");
  }
}

module.exports = TableSessionRepository;
