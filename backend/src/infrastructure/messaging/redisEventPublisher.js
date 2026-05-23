const Redis = require("ioredis");
const EventPublisherPort = require("../../application/ports/EventPublisher");

class RedisEventPublisher extends EventPublisherPort {
  constructor() {
    super();
    this.client = new Redis(process.env.REDIS_URL || "redis://localhost:6379");
  }

  async publish(event, payload) {
    await this.client.publish(event, JSON.stringify(payload));
  }
}

module.exports = new RedisEventPublisher();
