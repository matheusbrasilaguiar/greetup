const express = require("express");
const tablesController = require("../controllers/tables.controller");
const requireRole = require("../middleware/requireRole");

function createTablesRouter(authMiddleware) {
  const router = express.Router();

  router.use(authMiddleware);
  router.use(requireRole(["GERENTE", "ADMIN"]));

  router.post("/", tablesController.create);
  router.get("/", tablesController.list);
  router.get("/:id", tablesController.getById);
  router.patch("/:id/status", tablesController.updateStatus);

  return router;
}

module.exports = createTablesRouter;
