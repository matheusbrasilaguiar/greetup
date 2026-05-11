const jwt = require("jsonwebtoken");

const jwtSecret = process.env.JWT_SECRET || "change-me";

function sign(user) {
  return jwt.sign(
    { role: user.role, email: user.email },
    jwtSecret,
    { subject: user.id, expiresIn: "1d" }
  );
}

function verify(token) {
  return jwt.verify(token, jwtSecret);
}

module.exports = {
  sign,
  verify
};
