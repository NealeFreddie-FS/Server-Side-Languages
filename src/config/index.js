/**
 * Application configuration
 */
const config = {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || "development",
  mongodb: {
    uri: process.env.MONGO_URI || "mongodb://localhost:27017/fantasy_kingdoms",
  },
  cors: {
    allowedOrigins: ["http://localhost:3000"],
  },
};

module.exports = config;
