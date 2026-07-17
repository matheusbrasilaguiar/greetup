const { EventStatus } = require("../constants/eventStatus");

class Event {
  constructor({ id, name, date, status, companyId, createdAt, updatedAt }) {
    this.id        = id;
    this.name      = name;
    this.date      = date;
    this.status    = status;
    this.companyId = companyId;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  static create({ name, date, companyId }) {
    if (!name || !name.trim()) {
      const error = new Error("Event name is required");
      error.status = 400;
      throw error;
    }
    if (!companyId) {
      const error = new Error("companyId is required");
      error.status = 400;
      throw error;
    }
    return new Event({
      name:      name.trim(),
      date:      date ? new Date(date) : new Date(),
      status:    EventStatus.DRAFT,
      companyId,
    });
  }
}

module.exports = Event;
