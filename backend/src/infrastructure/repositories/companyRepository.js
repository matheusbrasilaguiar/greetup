const CompanyRepositoryPort = require("../../application/ports/CompanyRepository");
const prisma = require("../database/prisma");

class CompanyRepository extends CompanyRepositoryPort {
  async createCompany(data) {
    return prisma.company.create({ data });
  }

  async getCompanyById(id) {
    return prisma.company.findUnique({ where: { id } });
  }
}

module.exports = new CompanyRepository();
