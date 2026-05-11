const User = require("../../domain/entities/User");

async function registerAdmin({ name, email, password }, { userRepository, hashService }) {
  const existing = await userRepository.getByEmail(email);
  if (existing) {
    const error = new Error("Email already in use");
    error.status = 409;
    throw error;
  }

  const passwordHash = await hashService.hash(password);

  const userEntity = User.createAdmin({ name, email, passwordHash });
  const user = await userRepository.createUser({
    name: userEntity.name,
    email: userEntity.email,
    passwordHash: userEntity.passwordHash,
    role: userEntity.role
  });

  return user;
}

module.exports = registerAdmin;
