class Company {
  constructor({ id, name, createdAt }) {
    this.id = id;
    this.name = name;
    this.createdAt = createdAt;
  }

  static create({ name }) {
    if (!name || typeof name !== "string" || !name.trim()) {
      const error = new Error("Company name is required");
      error.status = 400;
      throw error;
    }
    return new Company({ id: undefined, name: name.trim(), createdAt: undefined });
  }
}

module.exports = Company;
