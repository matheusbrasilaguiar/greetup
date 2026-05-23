const express = require("express");
const productsController = require("../controllers/products.controller");
const requireRole = require("../middleware/requireRole");

function createProductsRouter(authMiddleware) {
  const router = express.Router();

  router.use(authMiddleware);

  router.post("/", requireRole(["ADMIN"]), productsController.create);
  router.get("/", productsController.list);
  router.get("/:id", productsController.getById);
  router.patch("/:id", requireRole(["ADMIN"]), productsController.update);

  return router;
}

module.exports = createProductsRouter;
