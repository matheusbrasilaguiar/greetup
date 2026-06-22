const createUser = require("../../../application/usecases/createUser");
const getUserById = require("../../../application/usecases/getUserById");
const listUsers = require("../../../application/usecases/listUsers");
const updateUser = require("../../../application/usecases/updateUser");
const deleteUser = require("../../../application/usecases/deleteUser");
const { buildUserDeps } = require("../../../infrastructure/di/container");

function sanitize(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    operatorFunction: user.operatorFunction || null,
    createdAt: user.createdAt
  };
}

async function create(req, res, next) {
  try {
    const user = await createUser({ ...req.body, companyId: req.user.companyId }, buildUserDeps());
    return res.status(201).json(sanitize(user));
  } catch (err) {
    return next(err);
  }
}

async function getById(req, res, next) {
  try {
    const user = await getUserById({ id: req.params.id, companyId: req.user.companyId }, buildUserDeps());
    return res.json(sanitize(user));
  } catch (err) {
    return next(err);
  }
}

async function list(req, res, next) {
  try {
    const users = await listUsers({ companyId: req.user.companyId }, buildUserDeps());
    return res.json(users.map(sanitize));
  } catch (err) {
    return next(err);
  }
}

async function update(req, res, next) {
  try {
    const user = await updateUser(
      { id: req.params.id, ...req.body, companyId: req.user.companyId },
      buildUserDeps()
    );
    return res.json(sanitize(user));
  } catch (err) {
    return next(err);
  }
}

async function remove(req, res, next) {
  try {
    await deleteUser({ id: req.params.id, companyId: req.user.companyId }, buildUserDeps());
    return res.status(204).end();
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  create,
  getById,
  list,
  update,
  remove
};
