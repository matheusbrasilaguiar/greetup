class EventRepository {
  async createEvent(data) {
    throw new Error("EventRepository#createEvent not implemented");
  }

  async listEvents(companyId) {
    throw new Error("EventRepository#listEvents not implemented");
  }

  async getEventById(id, companyId) {
    throw new Error("EventRepository#getEventById not implemented");
  }

  async getActiveEvent(companyId) {
    throw new Error("EventRepository#getActiveEvent not implemented");
  }

  async updateEventStatus(id, status) {
    throw new Error("EventRepository#updateEventStatus not implemented");
  }
}

module.exports = EventRepository;
