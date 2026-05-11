class UserRepository {
  async getByEmail(email) {
    throw new Error("UserRepository#getByEmail not implemented");
  }

  async createUser(data) {
    throw new Error("UserRepository#createUser not implemented");
  }
}

module.exports = UserRepository;
