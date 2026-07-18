const { ProductCategories } = require("../constants/productCategories");

class Product {
  constructor({ id, name, description, category, subcategory, active, createdAt, updatedAt }) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.category = category;
    this.subcategory = subcategory ?? null;
    this.active = active;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  static create({ name, description, category, subcategory, active }) {
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
      subcategory: subcategory ?? null,
      active: active !== undefined ? Boolean(active) : true
    });
  }

  static update({ name, description, category, subcategory, active }) {
    if (category) {
      const categories = Object.values(ProductCategories);
      if (!categories.includes(category)) {
        const error = new Error("Invalid category");
        error.status = 400;
        throw error;
      }
    }

    if (active !== undefined && typeof active !== "boolean") {
      const error = new Error("Active must be boolean");
      error.status = 400;
      throw error;
    }

    return new Product({
      name,
      description,
      category,
      subcategory,
      active
    });
  }
}

module.exports = Product;
