const Customer = require("../../domain/entities/Customer");

async function updateCustomer({ id, name, email, phone, employer, companyId }, { customerRepository }) {
  if (!id) {
    const error = new Error("Id is required");
    error.status = 400;
    throw error;
  }

  const hasUpdates =
    name !== undefined ||
    email !== undefined ||
    phone !== undefined ||
    employer !== undefined;

  if (!hasUpdates) {
    const error = new Error("No fields to update");
    error.status = 400;
    throw error;
  }

  const customerEntity = Customer.update({ name, email, phone, employer });

  const data = {};
  if (customerEntity.name !== undefined) data.name = customerEntity.name;
  if (customerEntity.email !== undefined) data.email = customerEntity.email;
  if (customerEntity.phone !== undefined) data.phone = customerEntity.phone;
  if (customerEntity.employer !== undefined) data.employer = customerEntity.employer;

  return customerRepository.updateCustomer(id, data, companyId);
}

module.exports = updateCustomer;
