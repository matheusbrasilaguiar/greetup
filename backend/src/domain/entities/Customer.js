class Customer {
  constructor({ id, name, email, phone, employer, createdAt, updatedAt }) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.phone = phone;
    this.employer = employer;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  static create({ name, email, phone, employer }) {
    if (!name) {
      const error = new Error("Name is required");
      error.status = 400;
      throw error;
    }

    return new Customer({ name, email, phone, employer });
  }

  static update({ name, email, phone, employer }) {
    return new Customer({ name, email, phone, employer });
  }
}

module.exports = Customer;
