require("dotenv").config();
const http = require("http");
const config = require("./src/config");
const app = require("./src/app");
const connectDB = require("./src/db");

(async () => {
  // Try to connect to database but continue even if it fails
  const dbConnected = await connectDB();

  const server = http.createServer(app);

  server.listen(config.port, () => {
    console.log(`Server is running on port ${config.port}`);
    console.log(`API is available at http://localhost:${config.port}/api`);

    if (!dbConnected) {
      console.log(
        "Warning: Running without database connection. API will return mock data."
      );
    }
  });
})();
