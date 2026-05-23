async function getProductById({ id, companyId }, { productRepository }) {
  if (!id) {
    const error = new Error("Id is required");
    error.status = 400;
    throw error;
  }

  const product = await productRepository.getProductById(id, companyId);

  if (!product) {
    const error = new Error("Product not found");
    error.status = 404;
    throw error;
  }

  return product;
}

module.exports = getProductById;
