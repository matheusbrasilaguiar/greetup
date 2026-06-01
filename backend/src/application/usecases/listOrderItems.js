async function listOrderItems({ companyId, status }, { orderRepository }) {
  return orderRepository.listItems({ companyId, status });
}

module.exports = listOrderItems;
