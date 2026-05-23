class UserRepository {
  async getByEmail(email, companyId) {
    throw new Error("UserRepository#getByEmail not implemented");
  }

  async getUserById(id, companyId) {
    throw new Error("UserRepository#getUserById not implemented");
  }

  async listUsers(companyId) {
    throw new Error("UserRepository#listUsers not implemented");
  }

  async createUser(data) {
    throw new Error("UserRepository#createUser not implemented");
  }
}

module.exports = UserRepository;
