const jwt = require("jsonwebtoken");

function setupWebSocket(io) {
  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;

    if (!token) {
      return next(new Error("Unauthorized: token not provided"));
    }

    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      socket.user = {
        id: payload.sub,
        role: payload.role,
        companyId: payload.companyId
      };
      next();
    } catch {
      next(new Error("Unauthorized: invalid token"));
    }
  });

  io.on("connection", (socket) => {
    const { id, role, companyId } = socket.user;

    socket.join(`company:${companyId}`);
    socket.join(`company:${companyId}:role:${role}`);

    console.log(`[Gateway] Client connected — user: ${id}, role: ${role}, company: ${companyId}`);

    socket.on("disconnect", (reason) => {
      console.log(`[Gateway] Client disconnected — user: ${id}, reason: ${reason}`);
    });
  });
}

module.exports = { setupWebSocket };
