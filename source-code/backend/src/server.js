const app = require("./app");
const env = require("./config/env");
const { checkDatabaseConnection, pool } = require("./config/database");

const PORT = env.port;

const startServer = async () => {
  try {
    await checkDatabaseConnection();
    console.log("Database connected successfully.");

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

process.on("SIGINT", async () => {
  await pool.end();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  await pool.end();
  process.exit(0);
});

startServer();
