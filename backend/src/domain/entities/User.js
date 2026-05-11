const { Roles } = require("../constants/roles");

class User {
  constructor({ id, name, email, passwordHash, role, createdAt }) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.passwordHash = passwordHash;
    this.role = role;
    this.createdAt = createdAt;
  }

  static createAdmin({ name, email, passwordHash }) {
    if (!name || !email || !passwordHash) {
      const error = new Error("Name, email and password are required");
      error.status = 400;
      throw error;
    }

    return new User({
      name,
      email,
      passwordHash,
      role: Roles.ADMIN
    });
  }
}

module.exports = User;
