const express = require("express");

const productsController = require("../controllers/products.controller");
const authMiddleware = require("../middleware/auth");
const requireRole = require("../middleware/requireRole");

const router = express.Router();

router.use(authMiddleware);

router.post("/", requireRole(["ADMIN"]), productsController.create);
router.get("/", productsController.list);
router.patch("/:id", requireRole(["ADMIN"]), productsController.update);

module.exports = router;
