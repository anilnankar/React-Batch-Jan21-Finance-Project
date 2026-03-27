const asyncHandler = require("../../utils/async-handler");

const getSystemHealth = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    message: "Finance backend is healthy",
    data: {
      uptimeSeconds: process.uptime(),
      timestamp: new Date().toISOString(),
    },
  });
});

module.exports = {
  getSystemHealth,
};
