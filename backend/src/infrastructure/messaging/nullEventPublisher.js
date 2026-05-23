const EventPublisherPort = require("../../application/ports/EventPublisher");

class NullEventPublisher extends EventPublisherPort {
  async publish(event, payload) {
    // no-op — substituir por RedisEventPublisher na Sprint 2
  }
}

module.exports = new NullEventPublisher();
