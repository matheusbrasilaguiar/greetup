require("dotenv").config();

const app = require("./app");
const eventPublisher = require("./infrastructure/messaging/rabbitmqEventPublisher");

const port = process.env.PORT || 3000;

app.listen(port, async () => {
  console.log(`API running on port ${port}`);
  await eventPublisher.connect();
});
