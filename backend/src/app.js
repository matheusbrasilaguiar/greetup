const express = require("express");
const cors = require("cors");

const { tokenService } = require("./infrastructure/di/container");
const createAuthMiddleware = require("./interfaces/http/middleware/auth");

const createAuthRouter = require("./interfaces/http/routes/auth.routes");
const createProductsRouter = require("./interfaces/http/routes/products.routes");
const createTablesRouter = require("./interfaces/http/routes/tables.routes");
const createUsersRouter = require("./interfaces/http/routes/users.routes");
const createCustomersRouter = require("./interfaces/http/routes/customers.routes");
const createOrdersRouter = require("./interfaces/http/routes/orders.routes");

const app = express();

app.use(cors());
app.use(express.json());

const authMiddleware = createAuthMiddleware(tokenService);

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/auth", createAuthRouter());
app.use("/products", createProductsRouter(authMiddleware));
app.use("/tables", createTablesRouter(authMiddleware));
app.use("/users", createUsersRouter(authMiddleware));
app.use("/customers", createCustomersRouter(authMiddleware));
app.use("/orders", createOrdersRouter(authMiddleware));

app.use((err, req, res, next) => {
  const status = err.status || 500;
  res.status(status).json({
    error: err.message || "Unexpected error"
  });
});

module.exports = app;
