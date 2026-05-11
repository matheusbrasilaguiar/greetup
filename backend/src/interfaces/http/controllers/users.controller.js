const createUser = require("../../../application/usecases/createUser");
const { buildUserDeps } = require("../../../infrastructure/di/container");

async function create(req, res, next) {
  try {
    const user = await createUser(req.body, buildUserDeps());

    return res.status(201).json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    });
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  create
};
