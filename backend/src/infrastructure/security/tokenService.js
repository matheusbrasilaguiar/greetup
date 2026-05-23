const TokenServicePort = require("../../application/ports/TokenService");
const jwt = require("jsonwebtoken");

const jwtSecret = process.env.JWT_SECRET || "change-me";

class TokenService extends TokenServicePort {
  sign(user) {
    return jwt.sign(
      { role: user.role, email: user.email, companyId: user.companyId },
      jwtSecret,
      { subject: user.id, expiresIn: "1d" }
    );
  }

  verify(token) {
    return jwt.verify(token, jwtSecret);
  }
}

module.exports = new TokenService();
