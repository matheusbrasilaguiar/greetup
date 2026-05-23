const Redis = require("ioredis");

function startSubscriber() {
  const subscriber = new Redis(process.env.REDIS_URL || "redis://localhost:6379");

  subscriber.subscribe("order:created", "order.item:status_changed", "order:closed", (err) => {
    if (err) console.error("[EventSubscriber] Failed to subscribe:", err);
    else console.log("[EventSubscriber] Subscribed to order channels");
  });

  subscriber.on("message", (channel, message) => {
    const payload = JSON.parse(message);
    console.log(`[EventSubscriber] [${new Date().toISOString()}] ${channel}:`, payload);
  });
}

module.exports = { startSubscriber };
