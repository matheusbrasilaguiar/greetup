async function listTables({ companyId }, { tableRepository }) {
  return tableRepository.listTables(companyId);
}

module.exports = listTables;
