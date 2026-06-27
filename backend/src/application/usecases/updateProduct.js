const Product = require("../../domain/entities/Product");

async function updateProduct({ id, name, description, category, active, price, companyId }, { productRepository }) {
  if (!id) {
    const error = new Error("Id is required");
    error.status = 400;
    throw error;
  }

  const hasUpdates =
    name !== undefined ||
    description !== undefined ||
    category !== undefined ||
    active !== undefined ||
    price !== undefined;

  if (!hasUpdates) {
    const error = new Error("No fields to update");
    error.status = 400;
    throw error;
  }

  const productEntity = Product.update({ name, description, category, active });

  const data = {};
  if (productEntity.name !== undefined) data.name = productEntity.name;
  if (productEntity.description !== undefined) data.description = productEntity.description;
  if (productEntity.category !== undefined) data.category = productEntity.category;
  if (productEntity.active !== undefined) data.active = productEntity.active;
  if (price !== undefined) data.price = price !== null && price !== "" ? Number(price) : null;

  return productRepository.updateProduct(id, data, companyId);
}

module.exports = updateProduct;
