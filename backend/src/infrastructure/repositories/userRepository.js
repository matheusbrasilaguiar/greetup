const UserRepositoryPort = require("../../application/ports/UserRepository");
const prisma = require("../database/prisma");

class UserRepository extends UserRepositoryPort {
  async getByEmail(email, companyId) {
    if (companyId) {
      return prisma.user.findFirst({ where: { email, companyId } });
    }
    return prisma.user.findFirst({ where: { email } });
  }

  async getUserById(id, companyId) {
    return prisma.user.findFirst({ where: { id, companyId } });
  }

  async listUsers(companyId) {
    return prisma.user.findMany({ where: { companyId }, orderBy: { createdAt: "desc" } });
  }

  async createUser(data) {
    return prisma.user.create({ data });
  }

  async updateUser(id, data, companyId) {
    return prisma.user.updateMany({ where: { id, companyId }, data });
  }

  async deleteUser(id, companyId) {
    return prisma.user.deleteMany({ where: { id, companyId } });
  }
}

module.exports = new UserRepository();
