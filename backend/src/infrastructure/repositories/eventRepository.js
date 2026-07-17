const EventRepositoryPort = require("../../application/ports/EventRepository");
const prisma = require("../database/prisma");

class EventRepository extends EventRepositoryPort {
  async createEvent(data) {
    return prisma.event.create({ data });
  }

  async listEvents(companyId) {
    return prisma.event.findMany({
      where: { companyId },
      orderBy: { date: "desc" },
    });
  }

  async getEventById(id, companyId) {
    return prisma.event.findFirst({ where: { id, companyId } });
  }

  async getActiveEvent(companyId) {
    return prisma.event.findFirst({
      where: { companyId, status: "ACTIVE" },
    });
  }

  async updateEventStatus(id, status) {
    return prisma.event.update({
      where: { id },
      data: { status },
    });
  }
}

module.exports = new EventRepository();
