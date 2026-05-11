class ProductRepository {
  async createProduct(data) {
    throw new Error("ProductRepository#createProduct not implemented");
  }

  async listProducts(includeInactive) {
    throw new Error("ProductRepository#listProducts not implemented");
  }

  async updateProduct(id, data) {
    throw new Error("ProductRepository#updateProduct not implemented");
  }
}

module.exports = ProductRepository;
