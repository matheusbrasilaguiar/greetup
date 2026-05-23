class CustomerRepository {
  async createCustomer(data) {
    throw new Error("CustomerRepository#createCustomer not implemented");
  }

  async getCustomerById(id, companyId) {
    throw new Error("CustomerRepository#getCustomerById not implemented");
  }

  async listCustomers(companyId) {
    throw new Error("CustomerRepository#listCustomers not implemented");
  }

  async updateCustomer(id, data, companyId) {
    throw new Error("CustomerRepository#updateCustomer not implemented");
  }
}

module.exports = CustomerRepository;
