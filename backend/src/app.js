const express = require("express");
const cors = require("cors");

const authRoutes = require("./interfaces/http/routes/auth.routes");
const productsRoutes = require("./interfaces/http/routes/products.routes");
const tablesRoutes = require("./interfaces/http/routes/tables.routes");
const usersRoutes = require("./interfaces/http/routes/users.routes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/auth", authRoutes);
app.use("/products", productsRoutes);
app.use("/tables", tablesRoutes);
app.use("/users", usersRoutes);

app.use((err, req, res, next) => {
  const status = err.status || 500;
  res.status(status).json({
    error: err.message || "Unexpected error"
  });
});

module.exports = app;
