async function listCustomers({ companyId, q }, { customerRepository }) {
  return customerRepository.listCustomers(companyId, q);
}

module.exports = listCustomers;
