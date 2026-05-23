require("dotenv").config();

const app = require("./app");

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`API running on port ${port}`);
});

const { startSubscriber } = require("./infrastructure/messaging/eventSubscriber");
startSubscriber();
