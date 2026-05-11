const Table = require("../../domain/entities/Table");

async function updateTableStatus({ id, status }, { tableRepository }) {
  if (!id) {
    const error = new Error("Id is required");
    error.status = 400;
    throw error;
  }

  Table.validateStatus(status);

  return tableRepository.updateStatus(id, status);
}

module.exports = updateTableStatus;
