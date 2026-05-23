const createProduct = require("../../../application/usecases/createProduct");
const getProductById = require("../../../application/usecases/getProductById");
const listProducts = require("../../../application/usecases/listProducts");
const updateProduct = require("../../../application/usecases/updateProduct");
const { buildProductDeps } = require("../../../infrastructure/di/container");

async function create(req, res, next) {
  try {
    const product = await createProduct(
      { ...req.body, companyId: req.user.companyId },
      buildProductDeps()
    );
    return res.status(201).json(product);
  } catch (err) {
    return next(err);
  }
}

async function getById(req, res, next) {
  try {
    const product = await getProductById(
      { id: req.params.id, companyId: req.user.companyId },
      buildProductDeps()
    );
    return res.json(product);
  } catch (err) {
    return next(err);
  }
}

async function list(req, res, next) {
  try {
    const products = await listProducts(
      {
        requestingUserRole: req.user.role,
        includeInactive: req.query.includeInactive === "true",
        companyId: req.user.companyId
      },
      buildProductDeps()
    );
    return res.json(products);
  } catch (err) {
    return next(err);
  }
}

async function update(req, res, next) {
  try {
    const product = await updateProduct(
      { id: req.params.id, ...req.body, companyId: req.user.companyId },
      buildProductDeps()
    );
    return res.json(product);
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
