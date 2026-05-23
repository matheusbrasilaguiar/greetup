async function getUserById({ id, companyId }, { userRepository }) {
  if (!id) {
    const error = new Error("Id is required");
    error.status = 400;
    throw error;
  }

  const user = await userRepository.getUserById(id, companyId);

  if (!user) {
    const error = new Error("User not found");
    error.status = 404;
    throw error;
  }

  return user;
}

module.exports = getUserById;
