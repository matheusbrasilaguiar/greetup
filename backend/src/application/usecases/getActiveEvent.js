async function getActiveEvent({ companyId }, { eventRepository }) {
  return eventRepository.getActiveEvent(companyId);
}

module.exports = getActiveEvent;
