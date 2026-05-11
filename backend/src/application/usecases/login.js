async function login({ email, password }, { userRepository, hashService, tokenService }) {
  if (!email || !password) {
    const error = new Error("Email and password are required");
    error.status = 400;
    throw error;
  }

  const user = await userRepository.getByEmail(email);
  if (!user) {
    const error = new Error("Invalid credentials");
    error.status = 401;
    throw error;
  }

  const isValid = await hashService.compare(password, user.passwordHash);
  if (!isValid) {
    const error = new Error("Invalid credentials");
    error.status = 401;
    throw error;
  }

  const token = tokenService.sign(user);
  return { user, token };
}

module.exports = login;
