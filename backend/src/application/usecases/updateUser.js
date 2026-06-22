const { Roles } = require("../../domain/constants/roles");

const OperatorFunctions = ["COZINHA", "GARCOM", "DISPLAY"];

async function updateUser({ id, name, role, operatorFunction, companyId }, { userRepository }) {
  if (!id) {
    const error = new Error("Id is required");
    error.status = 400;
    throw error;
  }

  const hasUpdates = name !== undefined || role !== undefined || operatorFunction !== undefined;
  if (!hasUpdates) {
    const error = new Error("No fields to update");
    error.status = 400;
    throw error;
  }

  const existing = await userRepository.getUserById(id, companyId);
  if (!existing) {
    const error = new Error("User not found");
    error.status = 404;
    throw error;
  }

  const data = {};
  if (name !== undefined) data.name = name;

  if (role !== undefined) {
    const roles = Object.values(Roles);
    if (!roles.includes(role)) {
      const error = new Error("Invalid role");
      error.status = 400;
      throw error;
    }
    data.role = role;

    if (role === Roles.OPERADOR) {
      const fn = operatorFunction ?? existing.operatorFunction;
      if (!fn || !OperatorFunctions.includes(fn)) {
        const error = new Error(`operatorFunction must be one of: ${OperatorFunctions.join(", ")}`);
        error.status = 400;
        throw error;
      }
      data.operatorFunction = fn;
    } else {
      data.operatorFunction = null;
    }
  } else if (operatorFunction !== undefined) {
    const effectiveRole = existing.role;
    if (effectiveRole !== Roles.OPERADOR) {
      const error = new Error("operatorFunction is only valid for OPERADOR role");
      error.status = 400;
      throw error;
    }
    if (!OperatorFunctions.includes(operatorFunction)) {
      const error = new Error(`operatorFunction must be one of: ${OperatorFunctions.join(", ")}`);
      error.status = 400;
      throw error;
    }
    data.operatorFunction = operatorFunction;
  }

  await userRepository.updateUser(id, data, companyId);
  return userRepository.getUserById(id, companyId);
}

module.exports = updateUser;
