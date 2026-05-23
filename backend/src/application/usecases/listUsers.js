async function listUsers({ companyId }, { userRepository }) {
  return userRepository.listUsers(companyId);
}

module.exports = listUsers;
