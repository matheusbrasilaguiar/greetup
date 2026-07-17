const createEvent    = require("../../../application/usecases/createEvent");
const listEvents     = require("../../../application/usecases/listEvents");
const getActiveEvent = require("../../../application/usecases/getActiveEvent");
const activateEvent  = require("../../../application/usecases/activateEvent");
const closeEvent     = require("../../../application/usecases/closeEvent");
const { buildEventDeps } = require("../../../infrastructure/di/container");

async function create(req, res, next) {
  try {
    const event = await createEvent(
      { ...req.body, companyId: req.user.companyId },
      buildEventDeps()
    );
    return res.status(201).json(event);
  } catch (err) {
    return next(err);
  }
}

async function list(req, res, next) {
  try {
    const events = await listEvents(
      { companyId: req.user.companyId },
      buildEventDeps()
    );
    return res.json(events);
  } catch (err) {
    return next(err);
  }
}

async function getActive(req, res, next) {
  try {
    const event = await getActiveEvent(
      { companyId: req.user.companyId },
      buildEventDeps()
    );
    return res.json(event ?? null);
  } catch (err) {
    return next(err);
  }
}

async function activate(req, res, next) {
  try {
    const event = await activateEvent(
      { id: req.params.id, companyId: req.user.companyId },
      buildEventDeps()
    );
    return res.json(event);
  } catch (err) {
    return next(err);
  }
}

async function close(req, res, next) {
  try {
    const event = await closeEvent(
      { id: req.params.id, companyId: req.user.companyId },
      buildEventDeps()
    );
    return res.json(event);
  } catch (err) {
    return next(err);
  }
}

module.exports = { create, list, getActive, activate, close };
