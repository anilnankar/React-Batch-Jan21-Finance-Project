const asyncHandler = require("../../utils/async-handler");
const { checkDatabaseConnection } = require("../../config/database");

const getSystemHealth = asyncHandler(async (req, res) => {
  let databaseStatus = "up";

  try {
    await checkDatabaseConnection();
  } catch (error) {
    databaseStatus = "down";
  }

  res.status(200).json({
    success: true,
    message: "Finance backend is healthy",
    data: {
      uptimeSeconds: process.uptime(),
      timestamp: new Date().toISOString(),
      database: databaseStatus,
    },
  });
});

module.exports = {
  getSystemHealth,
};
