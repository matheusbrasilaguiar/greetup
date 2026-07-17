const express = require("express");
const eventsController = require("../controllers/events.controller");
const requireRole = require("../middleware/requireRole");

function createEventsRouter(authMiddleware) {
  const router = express.Router();

  router.use(authMiddleware);

  router.post("/",              requireRole(["ADMIN"]), eventsController.create);
  router.get("/",               requireRole(["ADMIN", "GERENTE", "OPERADOR"]), eventsController.list);
  router.get("/active",         requireRole(["ADMIN", "GERENTE", "OPERADOR"]), eventsController.getActive);
  router.patch("/:id/activate", requireRole(["ADMIN"]), eventsController.activate);
  router.patch("/:id/close",    requireRole(["ADMIN"]), eventsController.close);

  return router;
}

module.exports = createEventsRouter;
