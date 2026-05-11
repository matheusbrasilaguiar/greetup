const UserRepositoryPort = require("../../application/ports/UserRepository");
const ProductRepositoryPort = require("../../application/ports/ProductRepository");
const TableRepositoryPort = require("../../application/ports/TableRepository");
const userRepository = require("../repositories/userRepository");
const productRepository = require("../repositories/productRepository");
const tableRepository = require("../repositories/tableRepository");
const hashService = require("../security/hashService");
const tokenService = require("../security/tokenService");

function buildAuthDeps() {
  if (!(userRepository instanceof UserRepositoryPort)) {
    throw new Error("UserRepository does not implement port");
  }
  return { userRepository, hashService, tokenService };
}

function buildUserDeps() {
  if (!(userRepository instanceof UserRepositoryPort)) {
    throw new Error("UserRepository does not implement port");
  }
  return { userRepository, hashService };
}

function buildProductDeps() {
  if (!(productRepository instanceof ProductRepositoryPort)) {
    throw new Error("ProductRepository does not implement port");
  }
  return { productRepository };
}

function buildTableDeps() {
  if (!(tableRepository instanceof TableRepositoryPort)) {
    throw new Error("TableRepository does not implement port");
  }
  return { tableRepository };
}

module.exports = {
  buildAuthDeps,
  buildUserDeps,
  buildProductDeps,
  buildTableDeps
};
