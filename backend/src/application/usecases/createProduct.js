const Product = require("../../domain/entities/Product");

async function createProduct({ name, description, category, active, price, companyId }, { productRepository }) {
  const productEntity = Product.create({ name, description, category, active });

  return productRepository.createProduct({
    name: productEntity.name,
    description: productEntity.description,
    category: productEntity.category,
    active: productEntity.active,
    price: price !== undefined && price !== null && price !== "" ? Number(price) : null,
    companyId
  });
}

module.exports = createProduct;
