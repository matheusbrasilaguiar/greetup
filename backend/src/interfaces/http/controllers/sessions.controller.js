const openTableSession  = require("../../../application/usecases/openTableSession");
const closeTableSession = require("../../../application/usecases/closeTableSession");
const getActiveSession  = require("../../../application/usecases/getActiveSession");
const getSessionById    = require("../../../application/usecases/getSessionById");
const listSessions      = require("../../../application/usecases/listSessions");
const { buildTableSessionDeps } = require("../../../infrastructure/di/container");

async function open(req, res, next) {
  try {
    const session = await openTableSession(
      {
        tableId: req.params.tableId,
        customerId: req.body.customerId,
        attendantId: req.body.attendantId,
        companyId: req.user.companyId
      },
      buildTableSessionDeps()
    );
    return res.status(201).json(session);
  } catch (err) {
    return next(err);
  }
}

async function close(req, res, next) {
  try {
    const session = await closeTableSession(
      {
        sessionId: req.params.sessionId,
        companyId: req.user.companyId
      },
      buildTableSessionDeps()
    );
    return res.json(session);
  } catch (err) {
    return next(err);
  }
}

async function getActive(req, res, next) {
  try {
    const session = await getActiveSession(
      { tableId: req.params.tableId, companyId: req.user.companyId },
      buildTableSessionDeps()
    );
    return res.json(session);
  } catch (err) {
    return next(err);
  }
}

async function getById(req, res, next) {
  try {
    const session = await getSessionById(
      { sessionId: req.params.sessionId, companyId: req.user.companyId },
      buildTableSessionDeps()
    );
    return res.json(session);
  } catch (err) {
    return next(err);
  }
}

async function list(req, res, next) {
  try {
    const sessions = await listSessions(
      {
        companyId: req.user.companyId,
        tableId: req.params.tableId,
        onlyActive: req.query.onlyActive === "true"
      },
      buildTableSessionDeps()
    );
    return res.json(sessions);
  } catch (err) {
    return next(err);
  }
}

module.exports = { open, close, getActive, getById, list };
