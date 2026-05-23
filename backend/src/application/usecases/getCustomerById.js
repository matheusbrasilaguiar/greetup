async function getCustomerById({ id, companyId }, { customerRepository }) {
  if (!id) {
    const error = new Error("Id is required");
    error.status = 400;
    throw error;
  }

  const customer = await customerRepository.getCustomerById(id, companyId);

  if (!customer) {
    const error = new Error("Customer not found");
    error.status = 404;
    throw error;
  }

  return customer;
}

module.exports = getCustomerById;
