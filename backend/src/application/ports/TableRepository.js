class TableRepository {
  async createTable(data) {
    throw new Error("TableRepository#createTable not implemented");
  }

  async listTables() {
    throw new Error("TableRepository#listTables not implemented");
  }

  async updateStatus(id, status) {
    throw new Error("TableRepository#updateStatus not implemented");
  }
}

module.exports = TableRepository;
