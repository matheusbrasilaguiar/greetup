const Product = require("../../domain/entities/Product");

async function createProduct({ name, description, category, active, companyId }, { productRepository }) {
  const productEntity = Product.create({ name, description, category, active });

  return productRepository.createProduct({
    name: productEntity.name,
    description: productEntity.description,
    category: productEntity.category,
    active: productEntity.active,
    companyId
  });
}

module.exports = createProduct;
