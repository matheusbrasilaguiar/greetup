const HashServicePort = require("../../application/ports/HashService");
const bcrypt = require("bcryptjs");

class HashService extends HashServicePort {
  async hash(value) {
    return bcrypt.hash(value, 10);
  }

  async compare(value, hashed) {
    return bcrypt.compare(value, hashed);
  }
}

module.exports = new HashService();
