const CustomerRepositoryPort = require("../../application/ports/CustomerRepository");
const prisma = require("../database/prisma");

class CustomerRepository extends CustomerRepositoryPort {
  async createCustomer(data) {
    return prisma.customer.create({ data });
  }

  async getCustomerById(id, companyId) {
    return prisma.customer.findFirst({ where: { id, companyId } });
  }

  async listCustomers(companyId, q) {
    const where = { companyId };
    if (q) {
      where.OR = [
        { name:  { contains: q, mode: "insensitive" } },
        { email: { contains: q, mode: "insensitive" } }
      ];
    }
    return prisma.customer.findMany({ where, orderBy: { name: "asc" } });
  }

  async updateCustomer(id, data, companyId) {
    return prisma.customer.updateMany({
      where: { id, companyId },
      data
    }).then(() => prisma.customer.findFirst({ where: { id, companyId } }));
  }
}

module.exports = new CustomerRepository();
