const tokenService = require("../../../infrastructure/security/tokenService");

function authMiddleware(req, res, next) {
  const header = req.headers.authorization || "";
  const [type, token] = header.split(" ");

  if (type !== "Bearer" || !token) {
    return res.status(401).json({ error: "Missing or invalid token" });
  }

  try {
    const payload = tokenService.verify(token);
    req.user = {
      id: payload.sub,
      role: payload.role,
      email: payload.email
    };
    return next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
}

module.exports = authMiddleware;
