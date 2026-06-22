async function deleteUser({ id, companyId }, { userRepository }) {
  if (!id) {
    const error = new Error("Id is required");
    error.status = 400;
    throw error;
  }

  const existing = await userRepository.getUserById(id, companyId);
  if (!existing) {
    const error = new Error("User not found");
    error.status = 404;
    throw error;
  }

  await userRepository.deleteUser(id, companyId);
}

module.exports = deleteUser;
