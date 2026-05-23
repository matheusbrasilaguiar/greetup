class TableRepository {
  async createTable(data) {
    throw new Error("TableRepository#createTable not implemented");
  }

  async getTableById(id, companyId) {
    throw new Error("TableRepository#getTableById not implemented");
  }

  async listTables(companyId) {
    throw new Error("TableRepository#listTables not implemented");
  }

  async updateStatus(id, status, companyId) {
    throw new Error("TableRepository#updateStatus not implemented");
  }
}

module.exports = TableRepository;
