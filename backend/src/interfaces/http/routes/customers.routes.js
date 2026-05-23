const express = require("express");
const customersController = require("../controllers/customers.controller");
const requireRole = require("../middleware/requireRole");

function createCustomersRouter(authMiddleware) {
  const router = express.Router();

  router.use(authMiddleware);
  router.use(requireRole(["GERENTE", "ADMIN"]));

  router.post("/", customersController.create);
  router.get("/", customersController.list);
  router.get("/:id", customersController.getById);
  router.patch("/:id", customersController.update);

  return router;
}

module.exports = createCustomersRouter;
