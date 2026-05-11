const express = require("express");

const usersController = require("../controllers/users.controller");
const authMiddleware = require("../middleware/auth");
const requireRole = require("../middleware/requireRole");

const router = express.Router();

router.use(authMiddleware);
router.use(requireRole(["ADMIN"]));

router.post("/", usersController.create);

module.exports = router;
