const Table = require("../../domain/entities/Table");

async function updateTableStatus({ id, status, companyId }, { tableRepository }) {
  if (!id) {
    const error = new Error("Id is required");
    error.status = 400;
    throw error;
  }

  Table.validateStatus(status);

  return tableRepository.updateStatus(id, status, companyId);
}

module.exports = updateTableStatus;
