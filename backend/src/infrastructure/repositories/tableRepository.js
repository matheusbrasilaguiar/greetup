const TableRepositoryPort = require("../../application/ports/TableRepository");
const prisma = require("../database/prisma");

class TableRepository extends TableRepositoryPort {
  async createTable(data) {
    return prisma.table.create({ data });
  }

  async getTableById(id, companyId) {
    return prisma.table.findFirst({ where: { id, companyId } });
  }

  async listTables(companyId) {
    return prisma.table.findMany({ where: { companyId }, orderBy: { createdAt: "desc" } });
  }

  async updateStatus(id, status, companyId) {
    return prisma.table.updateMany({
      where: { id, companyId },
      data: { status }
    }).then(() => prisma.table.findFirst({ where: { id, companyId } }));
  }
}

module.exports = new TableRepository();
