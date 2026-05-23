const Table = require("../../domain/entities/Table");

async function createTable({ code, companyId }, { tableRepository }) {
  const tableEntity = Table.create({ code });

  return tableRepository.createTable({
    code: tableEntity.code,
    status: tableEntity.status,
    companyId
  });
}

module.exports = createTable;
