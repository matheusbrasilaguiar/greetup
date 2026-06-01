require("dotenv").config();

const http = require("http");
const { Server } = require("socket.io");
const { setupWebSocket } = require("./websocket/server");
const { startConsumer } = require("./rabbitmq/consumer");

const port = process.env.PORT || 3001;

const server = http.createServer();
const io = new Server(server, {
  cors: { origin: "*" }
});

setupWebSocket(io);

server.listen(port, async () => {
  console.log(`[Gateway] WebSocket server running on port ${port}`);
  await startConsumer(io);
});
