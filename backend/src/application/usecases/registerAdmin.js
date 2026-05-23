const User = require("../../domain/entities/User");
const Company = require("../../domain/entities/Company");

async function registerAdmin({ name, email, password, companyName }, { userRepository, hashService, companyRepository }) {
  const companyEntity = Company.create({ name: companyName });
  const company = await companyRepository.createCompany({ name: companyEntity.name });

  const existing = await userRepository.getByEmail(email, company.id);
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
    role: userEntity.role,
    companyId: company.id
  });

  return user;
}

module.exports = registerAdmin;
