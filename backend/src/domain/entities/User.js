const { Roles } = require("../constants/roles");

const OperatorFunctions = ["COZINHA", "GARCOM", "DISPLAY"];

class User {
  constructor({ id, name, email, passwordHash, role, operatorFunction, createdAt }) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.passwordHash = passwordHash;
    this.role = role;
    this.operatorFunction = operatorFunction || null;
    this.createdAt = createdAt;
  }

  static createAdmin({ name, email, passwordHash }) {
    return User.createWithRole({ name, email, passwordHash, role: Roles.ADMIN });
  }

  static createWithRole({ name, email, passwordHash, role, operatorFunction }) {
    if (!name || !email || !passwordHash) {
      const error = new Error("Name, email and password are required");
      error.status = 400;
      throw error;
    }

    const roles = Object.values(Roles);
    if (!roles.includes(role)) {
      const error = new Error("Invalid role");
      error.status = 400;
      throw error;
    }

    if (role === Roles.OPERADOR) {
      if (!operatorFunction) {
        const error = new Error("operatorFunction is required for OPERADOR role");
        error.status = 400;
        throw error;
      }
      if (!OperatorFunctions.includes(operatorFunction)) {
        const error = new Error(`operatorFunction must be one of: ${OperatorFunctions.join(", ")}`);
        error.status = 400;
        throw error;
      }
    }

    return new User({
      name,
      email,
      passwordHash,
      role,
      operatorFunction: role === Roles.OPERADOR ? operatorFunction : null
    });
  }
}

module.exports = User;
