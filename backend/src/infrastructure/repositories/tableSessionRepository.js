const TableSessionRepositoryPort = require("../../application/ports/TableSessionRepository");
const prisma = require("../database/prisma");

const SESSION_INCLUDE = {
  table: { select: { id: true, code: true, status: true } },
  customer: { select: { id: true, name: true, email: true, phone: true, employer: true } },
  attendant: { select: { id: true, name: true, role: true } },
  orders: {
    include: {
      items: {
        include: { product: true },
        orderBy: { createdAt: "asc" }
      }
    },
    orderBy: { createdAt: "desc" }
  }
};

class TableSessionRepository extends TableSessionRepositoryPort {
  async createSession(data) {
    return prisma.tableSession.create({
      data,
      include: SESSION_INCLUDE
    });
  }

  async getActiveSessionByTable(tableId, companyId) {
    return prisma.tableSession.findFirst({
      where: { tableId, companyId, closedAt: null },
      include: SESSION_INCLUDE
    });
  }

  async getSessionById(id, companyId) {
    return prisma.tableSession.findFirst({
      where: { id, companyId },
      include: SESSION_INCLUDE
    });
  }

  async closeSession(id) {
    return prisma.tableSession.update({
      where: { id },
      data: { closedAt: new Date() },
      include: SESSION_INCLUDE
    });
  }

  async listSessions({ companyId, tableId, eventId, onlyActive } = {}) {
    const where = { companyId };
    if (tableId) where.tableId = tableId;
    if (eventId) where.eventId = eventId;
    if (onlyActive) where.closedAt = null;

    return prisma.tableSession.findMany({
      where,
      include: {
        table: { select: { id: true, code: true, status: true } },
        customer: { select: { id: true, name: true } },
        attendant: { select: { id: true, name: true, role: true } },
        orders: { select: { id: true, status: true } }
      },
      orderBy: { openedAt: "desc" }
    });
  }

  async closeEventSessions(eventId, companyId) {
    const sessions = await prisma.tableSession.findMany({
      where: { eventId, companyId, closedAt: null },
      select: { id: true, tableId: true }
    });
    if (sessions.length > 0) {
      await prisma.tableSession.updateMany({
        where: { eventId, companyId, closedAt: null },
        data: { closedAt: new Date() }
      });
    }
    return sessions;
  }

  async closeOrphanSessions(companyId) {
    const sessions = await prisma.tableSession.findMany({
      where: { companyId, eventId: null, closedAt: null },
      select: { id: true, tableId: true }
    });
    if (sessions.length > 0) {
      await prisma.tableSession.updateMany({
        where: { companyId, eventId: null, closedAt: null },
        data: { closedAt: new Date() }
      });
    }
    return sessions;
  }
}

module.exports = new TableSessionRepository();
