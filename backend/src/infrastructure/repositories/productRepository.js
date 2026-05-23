const ProductRepositoryPort = require("../../application/ports/ProductRepository");
const prisma = require("../database/prisma");

class ProductRepository extends ProductRepositoryPort {
  async createProduct(data) {
    return prisma.product.create({ data });
  }

  async getProductById(id, companyId) {
    return prisma.product.findFirst({ where: { id, companyId } });
  }

  async listProducts(includeInactive, companyId) {
    const where = { companyId };
    if (!includeInactive) where.active = true;
    return prisma.product.findMany({ where, orderBy: { createdAt: "desc" } });
  }

  async updateProduct(id, data, companyId) {
    return prisma.product.updateMany({
      where: { id, companyId },
      data
    }).then(() => prisma.product.findFirst({ where: { id, companyId } }));
  }
}

module.exports = new ProductRepository();
