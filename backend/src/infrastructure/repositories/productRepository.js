const ProductRepositoryPort = require("../../application/ports/ProductRepository");
const prisma = require("../database/prisma");

class ProductRepository extends ProductRepositoryPort {
  async createProduct(data) {
    return prisma.product.create({ data });
  }

  async listProducts(includeInactive) {
    if (includeInactive) {
      return prisma.product.findMany({ orderBy: { createdAt: "desc" } });
    }

    return prisma.product.findMany({
      where: { active: true },
      orderBy: { createdAt: "desc" }
    });
  }
}

module.exports = new ProductRepository();
