async function getOrderById({ id, companyId }, { orderRepository }) {
  if (!id) {
    const error = new Error("Id is required");
    error.status = 400;
    throw error;
  }

  const order = await orderRepository.getOrderById(id, companyId);

  if (!order) {
    const error = new Error("Order not found");
    error.status = 404;
    throw error;
  }

  return order;
}

module.exports = getOrderById;
