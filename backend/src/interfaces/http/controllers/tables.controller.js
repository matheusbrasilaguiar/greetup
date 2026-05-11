const createTable = require("../../../application/usecases/createTable");
const listTables = require("../../../application/usecases/listTables");
const updateTableStatus = require("../../../application/usecases/updateTableStatus");
const { buildTableDeps } = require("../../../infrastructure/di/container");

async function create(req, res, next) {
  try {
    const table = await createTable(req.body, buildTableDeps());
    return res.status(201).json(table);
  } catch (err) {
    return next(err);
  }
}

async function list(req, res, next) {
  try {
    const tables = await listTables(null, buildTableDeps());
    return res.json(tables);
  } catch (err) {
    return next(err);
  }
}

async function updateStatus(req, res, next) {
  try {
    const table = await updateTableStatus(
      { id: req.params.id, status: req.body.status },
      buildTableDeps()
    );
    return res.json(table);
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  create,
  list,
  updateStatus
};
