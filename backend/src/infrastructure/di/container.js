const UserRepositoryPort = require("../../application/ports/UserRepository");
const ProductRepositoryPort = require("../../application/ports/ProductRepository");
const userRepository = require("../repositories/userRepository");
const productRepository = require("../repositories/productRepository");
const hashService = require("../security/hashService");
const tokenService = require("../security/tokenService");

function buildAuthDeps() {
  if (!(userRepository instanceof UserRepositoryPort)) {
    throw new Error("UserRepository does not implement port");
  }
  return { userRepository, hashService, tokenService };
}

function buildProductDeps() {
  if (!(productRepository instanceof ProductRepositoryPort)) {
    throw new Error("ProductRepository does not implement port");
  }
  return { productRepository };
}

module.exports = {
  buildAuthDeps,
  buildProductDeps
};
