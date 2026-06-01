const amqplib = require("amqplib");
const { routeEvent } = require("../websocket/eventRouter");

const EXCHANGE = "greetup.events";
const QUEUE    = "gateway.queue";
const DLQ      = "gateway.queue.dlq";

async function startConsumer(io) {
  const url = process.env.RABBITMQ_URL || "amqp://localhost";
  const conn = await amqplib.connect(url);

  conn.on("error", (err) => console.error("[Gateway] RabbitMQ connection error:", err.message));
  conn.on("close", () => console.error("[Gateway] RabbitMQ connection closed unexpectedly"));

  const channel = await conn.createChannel();

  await channel.assertExchange(EXCHANGE, "topic", { durable: true });

  await channel.assertQueue(DLQ, { durable: true });

  await channel.assertQueue(QUEUE, {
    durable: true,
    arguments: {
      "x-dead-letter-exchange":    "",
      "x-dead-letter-routing-key": DLQ
    }
  });

  await channel.bindQueue(QUEUE, EXCHANGE, "#");

  channel.prefetch(1);

  channel.consume(QUEUE, (msg) => {
    if (!msg) return;

    const routingKey = msg.fields.routingKey;

    try {
      const payload = JSON.parse(msg.content.toString());
      console.log(`[Gateway] [${new Date().toISOString()}] ${routingKey}:`, payload);
      routeEvent(io, routingKey, payload);
      channel.ack(msg);
    } catch (err) {
      console.error(`[Gateway] Failed to process message [${routingKey}]:`, err.message);
      channel.nack(msg, false, false);
    }
  });

  console.log(`[Gateway] Consumer listening on queue: ${QUEUE}`);
}

module.exports = { startConsumer };
