const express = require("express");
const usersController = require("../controllers/users.controller");
const requireRole = require("../middleware/requireRole");

function createUsersRouter(authMiddleware) {
  const router = express.Router();

  router.use(authMiddleware);
  router.use(requireRole(["ADMIN"]));

  router.post("/", usersController.create);
  router.get("/", usersController.list);
  router.get("/:id", usersController.getById);

  return router;
}

module.exports = createUsersRouter;
