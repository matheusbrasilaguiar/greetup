const express = require("express");
const tablesController   = require("../controllers/tables.controller");
const sessionsController = require("../controllers/sessions.controller");
const requireRole = require("../middleware/requireRole");

function createTablesRouter(authMiddleware) {
  const router = express.Router();

  router.use(authMiddleware);
  router.use(requireRole(["GERENTE", "ADMIN"]));

  // ─── Tables ───────────────────────────────────────────────────────────────
  router.post("/",              tablesController.create);
  router.get("/",               tablesController.list);
  router.get("/:id",            tablesController.getById);
  router.patch("/:id/status",   tablesController.updateStatus);

  // ─── Sessions (nested) ────────────────────────────────────────────────────
  router.post("/:tableId/sessions",                        sessionsController.open);
  router.get("/:tableId/sessions",                         sessionsController.list);
  router.get("/:tableId/sessions/active",                  sessionsController.getActive);
  router.get("/:tableId/sessions/:sessionId",              sessionsController.getById);
  router.patch("/:tableId/sessions/:sessionId/close",      sessionsController.close);

  return router;
}

module.exports = createTablesRouter;
