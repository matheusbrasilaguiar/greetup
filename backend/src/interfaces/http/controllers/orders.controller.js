const createOrder      = require("../../../application/usecases/createOrder");
const getOrderById     = require("../../../application/usecases/getOrderById");
const listOrders       = require("../../../application/usecases/listOrders");
const listOrderItems   = require("../../../application/usecases/listOrderItems");
const updateItemStatus = require("../../../application/usecases/updateItemStatus");
const closeOrder       = require("../../../application/usecases/closeOrder");
const { buildOrderDeps } = require("../../../infrastructure/di/container");

async function create(req, res, next) {
  try {
    const order = await createOrder(
      { ...req.body, companyId: req.user.companyId },
      buildOrderDeps()
    );
    return res.status(201).json(order);
  } catch (err) {
    return next(err);
  }
}

async function getById(req, res, next) {
  try {
    const order = await getOrderById(
      { id: req.params.id, companyId: req.user.companyId },
      buildOrderDeps()
    );
    return res.json(order);
  } catch (err) {
    return next(err);
  }
}

async function list(req, res, next) {
  try {
    const { sessionId, status } = req.query;
    const orders = await listOrders(
      { sessionId, status, companyId: req.user.companyId },
      buildOrderDeps()
    );
    return res.json(orders);
  } catch (err) {
    return next(err);
  }
}

async function patchItemStatus(req, res, next) {
  try {
    const item = await updateItemStatus(
      {
        orderId: req.params.orderId,
        itemId: req.params.itemId,
        status: req.body.status,
        companyId: req.user.companyId
      },
      buildOrderDeps()
    );
    return res.json(item);
  } catch (err) {
    return next(err);
  }
}

async function close(req, res, next) {
  try {
    const order = await closeOrder(
      { id: req.params.id, companyId: req.user.companyId },
      buildOrderDeps()
    );
    return res.json(order);
  } catch (err) {
    return next(err);
  }
}

async function listItems(req, res, next) {
  try {
    const { status } = req.query;
    const items = await listOrderItems(
      { companyId: req.user.companyId, status },
      buildOrderDeps()
    );
    return res.json(items);
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  create,
  getById,
  list,
  listItems,
  patchItemStatus,
  close
};
