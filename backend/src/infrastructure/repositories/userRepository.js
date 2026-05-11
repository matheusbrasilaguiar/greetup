const UserRepositoryPort = require("../../application/ports/UserRepository");
const prisma = require("../database/prisma");

class UserRepository extends UserRepositoryPort {
  async getByEmail(email) {
    return prisma.user.findUnique({ where: { email } });
  }

  async createUser(data) {
    return prisma.user.create({ data });
  }
}

module.exports = new UserRepository();
