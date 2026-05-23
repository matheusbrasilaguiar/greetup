async function getTableById({ id, companyId }, { tableRepository }) {
  if (!id) {
    const error = new Error("Id is required");
    error.status = 400;
    throw error;
  }

  const table = await tableRepository.getTableById(id, companyId);

  if (!table) {
    const error = new Error("Table not found");
    error.status = 404;
    throw error;
  }

  return table;
}

module.exports = getTableById;
