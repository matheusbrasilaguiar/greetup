const UserRepositoryPort = require("../../application/ports/UserRepository");
const ProductRepositoryPort = require("../../application/ports/ProductRepository");
const TableRepositoryPort = require("../../application/ports/TableRepository");
const CustomerRepositoryPort = require("../../application/ports/CustomerRepository");
const OrderRepositoryPort = require("../../application/ports/OrderRepository");
const CompanyRepositoryPort = require("../../application/ports/CompanyRepository");
const HashServicePort = require("../../application/ports/HashService");
const TokenServicePort = require("../../application/ports/TokenService");
const EventPublisherPort = require("../../application/ports/EventPublisher");

const userRepository = require("../repositories/userRepository");
const productRepository = require("../repositories/productRepository");
const tableRepository = require("../repositories/tableRepository");
const customerRepository = require("../repositories/customerRepository");
const orderRepository = require("../repositories/orderRepository");
const companyRepository = require("../repositories/companyRepository");
const hashService = require("../security/hashService");
const tokenService = require("../security/tokenService");
const eventPublisher = require("../messaging/redisEventPublisher");

const bindings = [
  [userRepository, UserRepositoryPort, "UserRepository"],
  [productRepository, ProductRepositoryPort, "ProductRepository"],
  [tableRepository, TableRepositoryPort, "TableRepository"],
  [customerRepository, CustomerRepositoryPort, "CustomerRepository"],
  [orderRepository, OrderRepositoryPort, "OrderRepository"],
  [companyRepository, CompanyRepositoryPort, "CompanyRepository"],
  [hashService, HashServicePort, "HashService"],
  [tokenService, TokenServicePort, "TokenService"],
  [eventPublisher, EventPublisherPort, "EventPublisher"]
];

bindings.forEach(([impl, Port, name]) => {
  if (!(impl instanceof Port)) {
    throw new Error(`${name} does not implement its port`);
  }
});

function buildAuthDeps() {
  return { userRepository, hashService, tokenService, companyRepository };
}

function buildUserDeps() {
  return { userRepository, hashService };
}

function buildProductDeps() {
  return { productRepository };
}

function buildTableDeps() {
  return { tableRepository };
}

function buildCustomerDeps() {
  return { customerRepository };
}

function buildOrderDeps() {
  return { orderRepository, eventPublisher };
}

module.exports = {
  buildAuthDeps,
  buildUserDeps,
  buildProductDeps,
  buildTableDeps,
  buildCustomerDeps,
  buildOrderDeps,
  tokenService
};
