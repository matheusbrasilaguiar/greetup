const TableRepositoryPort = require("../../application/ports/TableRepository");
const prisma = require("../database/prisma");

class TableRepository extends TableRepositoryPort {
  async createTable(data) {
    return prisma.table.create({ data });
  }

  async listTables() {
    return prisma.table.findMany({ orderBy: { createdAt: "desc" } });
  }

  async updateStatus(id, status) {
    return prisma.table.update({
      where: { id },
      data: { status }
    });
  }
}

module.exports = new TableRepository();
