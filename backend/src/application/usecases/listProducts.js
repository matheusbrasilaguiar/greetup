const { Roles } = require("../../domain/constants/roles");

async function listProducts({ requestingUserRole, includeInactive, companyId }, { productRepository }) {
  const canSeeInactive = requestingUserRole === Roles.ADMIN;
  const shouldIncludeInactive = canSeeInactive && includeInactive === true;
  return productRepository.listProducts(shouldIncludeInactive, companyId);
}

module.exports = listProducts;
