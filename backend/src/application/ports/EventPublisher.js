class EventPublisher {
  async publish(event, payload) {
    throw new Error("EventPublisher#publish not implemented");
  }
}

module.exports = EventPublisher;
