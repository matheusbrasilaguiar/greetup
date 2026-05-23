async function listCustomers({ companyId }, { customerRepository }) {
  return customerRepository.listCustomers(companyId);
}

module.exports = listCustomers;
