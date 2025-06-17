require("dotenv").config();
const http = require("http");
const config = require("./src/config");
const app = require("./src/app");
const connectDB = require("./src/db");

connectDB();

const server = http.createServer(app);

server.listen(config.port, () => {
  console.log(`Server is running on port ${config.port}`);
  console.log(`API is available at http://localhost:${config.port}/api`);
});
