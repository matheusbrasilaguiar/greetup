const Event = require("../../domain/entities/Event");

async function createEvent({ name, date, companyId }, { eventRepository }) {
  const entity = Event.create({ name, date, companyId });
  return eventRepository.createEvent({
    name:      entity.name,
    date:      entity.date,
    status:    entity.status,
    companyId: entity.companyId,
  });
}

module.exports = createEvent;
