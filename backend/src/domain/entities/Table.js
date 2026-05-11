class Table {
  constructor({ id, code, status, createdAt, updatedAt }) {
    this.id = id;
    this.code = code;
    this.status = status;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  static create({ code }) {
    if (!code) {
      const error = new Error("Code is required");
      error.status = 400;
      throw error;
    }

    return new Table({ code, status: "OPEN" });
  }

  static validateStatus(status) {
    const allowed = ["OPEN", "OCCUPIED", "CLOSED"];
    if (!allowed.includes(status)) {
      const error = new Error("Invalid status");
      error.status = 400;
      throw error;
    }
  }
}

module.exports = Table;
