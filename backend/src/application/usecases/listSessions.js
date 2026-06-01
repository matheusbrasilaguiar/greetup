async function listSessions({ companyId, tableId, onlyActive }, { tableSessionRepository }) {
  return tableSessionRepository.listSessions({ companyId, tableId, onlyActive });
}

module.exports = listSessions;
