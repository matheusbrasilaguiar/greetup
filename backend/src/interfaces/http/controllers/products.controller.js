const createProduct = require("../../../application/usecases/createProduct");
const listProducts = require("../../../application/usecases/listProducts");
const updateProduct = require("../../../application/usecases/updateProduct");
const { buildProductDeps } = require("../../../infrastructure/di/container");

async function create(req, res, next) {
  try {
    const product = await createProduct(req.body, buildProductDeps());
    return res.status(201).json(product);
  } catch (err) {
    return next(err);
  }
}

async function list(req, res, next) {
  try {
    const includeInactive = req.user && req.user.role === "ADMIN" && req.query.includeInactive === "true";
    const products = await listProducts({ includeInactive }, buildProductDeps());
    return res.json(products);
  } catch (err) {
    return next(err);
  }
}

async function update(req, res, next) {
  try {
    const product = await updateProduct(
      { id: req.params.id, ...req.body },
      buildProductDeps()
    );
    return res.json(product);
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  create,
  list,
  update
};
