const bcrypt = require("bcryptjs");

async function hash(value) {
  return bcrypt.hash(value, 10);
}

async function compare(value, hashed) {
  return bcrypt.compare(value, hashed);
}

module.exports = {
  hash,
  compare
};
