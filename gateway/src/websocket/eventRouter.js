function routeEvent(io, routingKey, payload) {
  const { companyId } = payload;

  if (!companyId) {
    console.warn("[Gateway] Event missing companyId, skipping routing:", routingKey);
    return;
  }

  const companyRoom = `company:${companyId}`;

  switch (routingKey) {
    case "order.created":
      io.to(`${companyRoom}:role:OPERADOR`).emit("order_created", payload);
      io.to(`${companyRoom}:role:GERENTE`).emit("order_created", payload);
      break;

    case "order.item.status_changed":
      io.to(companyRoom).emit("order_item_status_changed", payload);
      break;

    case "order.closed":
      io.to(companyRoom).emit("order_closed", payload);
      break;

    case "table.session.opened":
      io.to(companyRoom).emit("table_session_opened", payload);
      break;

    case "table.session.closed":
      io.to(companyRoom).emit("table_session_closed", payload);
      break;

    default:
      console.warn("[Gateway] Unknown routing key:", routingKey);
  }
}

module.exports = { routeEvent };
