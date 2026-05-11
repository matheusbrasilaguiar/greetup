const User = require("../../domain/entities/User");

async function createUser({ name, email, password, role }, { userRepository, hashService }) {
  const existing = await userRepository.getByEmail(email);
  if (existing) {
    const error = new Error("Email already in use");
    error.status = 409;
    throw error;
  }

  const passwordHash = await hashService.hash(password);
  const userEntity = User.createWithRole({ name, email, passwordHash, role });

  return userRepository.createUser({
    name: userEntity.name,
    email: userEntity.email,
    passwordHash: userEntity.passwordHash,
    role: userEntity.role
  });
}

module.exports = createUser;
