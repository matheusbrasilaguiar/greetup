const registerAdmin = require("../../../application/usecases/registerAdmin");
const login = require("../../../application/usecases/login");
const { buildAuthDeps } = require("../../../infrastructure/di/container");

async function register(req, res, next) {
  try {
    const user = await registerAdmin(req.body, buildAuthDeps());

    return res.status(201).json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      companyId: user.companyId
    });
  } catch (err) {
    return next(err);
  }
}

async function loginHandler(req, res, next) {
  try {
    const { user, token } = await login(req.body, buildAuthDeps());

    return res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        operatorFunction: user.operatorFunction || null,
        companyId: user.companyId
      }
    });
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  register,
  login: loginHandler
};
