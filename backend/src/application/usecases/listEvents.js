async function listEvents({ companyId }, { eventRepository }) {
  return eventRepository.listEvents(companyId);
}

module.exports = listEvents;
