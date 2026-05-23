const express = require("express");
const ordersController = require("../controllers/orders.controller");
const requireRole = require("../middleware/requireRole");

function createOrdersRouter(authMiddleware) {
  const router = express.Router();

  router.use(authMiddleware);

  router.post("/", requireRole(["GERENTE"]), ordersController.create);
  router.get("/", requireRole(["GERENTE", "OPERADOR", "ADMIN"]), ordersController.list);
  router.get("/:id", requireRole(["GERENTE", "OPERADOR", "ADMIN"]), ordersController.getById);
  router.patch("/:id/close", requireRole(["GERENTE", "ADMIN"]), ordersController.close);
  router.patch(
    "/:orderId/items/:itemId/status",
    requireRole(["OPERADOR"]),
    ordersController.patchItemStatus
  );

  return router;
}

module.exports = createOrdersRouter;
