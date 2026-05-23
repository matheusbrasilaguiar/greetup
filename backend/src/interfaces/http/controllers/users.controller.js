const createUser = require("../../../application/usecases/createUser");
const getUserById = require("../../../application/usecases/getUserById");
const listUsers = require("../../../application/usecases/listUsers");
const { buildUserDeps } = require("../../../infrastructure/di/container");

function sanitize(user) {
  return { id: user.id, name: user.name, email: user.email, role: user.role, createdAt: user.createdAt };
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

module.exports = {
  create,
  getById,
  list
};
