class ProductRepository {
  async createProduct(data) {
    throw new Error("ProductRepository#createProduct not implemented");
  }

  async getProductById(id, companyId) {
    throw new Error("ProductRepository#getProductById not implemented");
  }

  async listProducts(includeInactive, companyId) {
    throw new Error("ProductRepository#listProducts not implemented");
  }

  async updateProduct(id, data, companyId) {
    throw new Error("ProductRepository#updateProduct not implemented");
  }
}

module.exports = ProductRepository;
