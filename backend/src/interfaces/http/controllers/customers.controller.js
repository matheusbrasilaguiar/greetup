const createCustomer = require("../../../application/usecases/createCustomer");
const getCustomerById = require("../../../application/usecases/getCustomerById");
const listCustomers = require("../../../application/usecases/listCustomers");
const updateCustomer = require("../../../application/usecases/updateCustomer");
const { buildCustomerDeps } = require("../../../infrastructure/di/container");

async function create(req, res, next) {
  try {
    const customer = await createCustomer(
      { ...req.body, companyId: req.user.companyId },
      buildCustomerDeps()
    );
    return res.status(201).json(customer);
  } catch (err) {
    return next(err);
  }
}

async function getById(req, res, next) {
  try {
    const customer = await getCustomerById(
      { id: req.params.id, companyId: req.user.companyId },
      buildCustomerDeps()
    );
    return res.json(customer);
  } catch (err) {
    return next(err);
  }
}

async function list(req, res, next) {
  try {
    const { q } = req.query;
    const customers = await listCustomers({ companyId: req.user.companyId, q }, buildCustomerDeps());
    return res.json(customers);
  } catch (err) {
    return next(err);
  }
}

async function update(req, res, next) {
  try {
    const customer = await updateCustomer(
      { id: req.params.id, ...req.body, companyId: req.user.companyId },
      buildCustomerDeps()
    );
    return res.json(customer);
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  create,
  getById,
  list,
  update
};
