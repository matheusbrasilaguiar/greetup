class TokenService {
  sign(user) {
    throw new Error("TokenService#sign not implemented");
  }

  verify(token) {
    throw new Error("TokenService#verify not implemented");
  }
}

module.exports = TokenService;
