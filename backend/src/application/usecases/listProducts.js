async function listProducts({ includeInactive }, { productRepository }) {
  return productRepository.listProducts(Boolean(includeInactive));
}

module.exports = listProducts;
