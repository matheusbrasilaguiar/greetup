async function listTables(_, { tableRepository }) {
  return tableRepository.listTables();
}

module.exports = listTables;
