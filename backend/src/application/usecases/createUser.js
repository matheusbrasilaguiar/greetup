const User = require("../../domain/entities/User");

async function createUser({ name, email, password, role, companyId }, { userRepository, hashService }) {
  const existing = await userRepository.getByEmail(email, companyId);
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
    role: userEntity.role,
    companyId
  });
}

module.exports = createUser;
