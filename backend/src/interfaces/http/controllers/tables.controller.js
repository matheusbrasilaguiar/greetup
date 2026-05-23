const createTable = require("../../../application/usecases/createTable");
const getTableById = require("../../../application/usecases/getTableById");
const listTables = require("../../../application/usecases/listTables");
const updateTableStatus = require("../../../application/usecases/updateTableStatus");
const { buildTableDeps } = require("../../../infrastructure/di/container");

async function create(req, res, next) {
  try {
    const table = await createTable(
      { ...req.body, companyId: req.user.companyId },
      buildTableDeps()
    );
    return res.status(201).json(table);
  } catch (err) {
    return next(err);
  }
}

async function getById(req, res, next) {
  try {
    const table = await getTableById(
      { id: req.params.id, companyId: req.user.companyId },
      buildTableDeps()
    );
    return res.json(table);
  } catch (err) {
    return next(err);
  }
}

async function list(req, res, next) {
  try {
    const tables = await listTables({ companyId: req.user.companyId }, buildTableDeps());
    return res.json(tables);
  } catch (err) {
    return next(err);
  }
}

async function updateStatus(req, res, next) {
  try {
    const table = await updateTableStatus(
      { id: req.params.id, status: req.body.status, companyId: req.user.companyId },
      buildTableDeps()
    );
    return res.json(table);
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  create,
  getById,
  list,
  updateStatus
};
