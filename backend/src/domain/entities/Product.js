const { ProductCategories } = require("../constants/productCategories");

class Product {
  constructor({ id, name, description, category, active, createdAt, updatedAt }) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.category = category;
    this.active = active;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  static create({ name, description, category, active }) {
    if (!name || !category) {
      const error = new Error("Name and category are required");
      error.status = 400;
      throw error;
    }

    const categories = Object.values(ProductCategories);
    if (!categories.includes(category)) {
      const error = new Error("Invalid category");
      error.status = 400;
      throw error;
    }

    return new Product({
      name,
      description,
      category,
      active: active !== undefined ? Boolean(active) : true
    });
  }
}

module.exports = Product;
