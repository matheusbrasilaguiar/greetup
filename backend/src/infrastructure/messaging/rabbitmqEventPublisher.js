const amqplib = require("amqplib");
const EventPublisherPort = require("../../application/ports/EventPublisher");

const EXCHANGE = "greetup.events";

class RabbitMQEventPublisher extends EventPublisherPort {
  constructor() {
    super();
    this.channel = null;
  }

  async connect() {
    const url = process.env.RABBITMQ_URL || "amqp://localhost";
    const conn = await amqplib.connect(url);

    conn.on("error", (err) => console.error("[RabbitMQ] Connection error:", err.message));
    conn.on("close", () => console.error("[RabbitMQ] Connection closed unexpectedly"));

    this.channel = await conn.createChannel();
    await this.channel.assertExchange(EXCHANGE, "topic", { durable: true });

    console.log("[RabbitMQ] Publisher connected to exchange:", EXCHANGE);
  }

  async publish(routingKey, payload) {
    if (!this.channel) {
      throw new Error("[RabbitMQ] Publisher not connected. Call connect() before publishing.");
    }
    const content = Buffer.from(JSON.stringify(payload));
    this.channel.publish(EXCHANGE, routingKey, content, { persistent: true });
  }
}

module.exports = new RabbitMQEventPublisher();
