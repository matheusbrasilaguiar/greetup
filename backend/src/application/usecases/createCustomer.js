const Customer = require("../../domain/entities/Customer");

async function createCustomer({ name, email, phone, employer, companyId }, { customerRepository }) {
  const customerEntity = Customer.create({ name, email, phone, employer });

  return customerRepository.createCustomer({
    name: customerEntity.name,
    email: customerEntity.email,
    phone: customerEntity.phone,
    employer: customerEntity.employer,
    companyId
  });
}

module.exports = createCustomer;
