class TableSession {
  constructor({ id, tableId, customerId, attendantId, companyId, openedAt, closedAt, table, customer, attendant, orders }) {
    this.id = id;
    this.tableId = tableId;
    this.customerId = customerId;
    this.attendantId = attendantId;
    this.companyId = companyId;
    this.openedAt = openedAt;
    this.closedAt = closedAt;
    this.table = table;
    this.customer = customer;
    this.attendant = attendant;
    this.orders = orders;
  }

  static create({ tableId, customerId, attendantId, companyId }) {
    if (!tableId) {
      const error = new Error("tableId is required");
      error.status = 400;
      throw error;
    }

    if (!attendantId) {
      const error = new Error("attendantId is required");
      error.status = 400;
      throw error;
    }

    return new TableSession({
      tableId,
      customerId: customerId || null,
      attendantId,
      companyId,
      openedAt: new Date(),
      closedAt: null
    });
  }

  get isActive() {
    return this.closedAt === null || this.closedAt === undefined;
  }
}

module.exports = TableSession;
