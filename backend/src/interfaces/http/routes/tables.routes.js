const express = require("express");

const tablesController = require("../controllers/tables.controller");
const authMiddleware = require("../middleware/auth");
const requireRole = require("../middleware/requireRole");

const router = express.Router();

router.use(authMiddleware);
router.use(requireRole(["GERENTE", "ADMIN"]));

router.post("/", tablesController.create);
router.get("/", tablesController.list);
router.patch("/:id/status", tablesController.updateStatus);

module.exports = router;
