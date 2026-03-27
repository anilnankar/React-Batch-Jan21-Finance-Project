const env = require("../config/env");

const globalErrorHandler = (error, req, res, next) => {
  const statusCode = error.statusCode || 500;
  const message = error.message || "Something went wrong";

  res.status(statusCode).json({
    success: false,
    message,
    ...(env.nodeEnv !== "production" && { stack: error.stack }),
  });
};

module.exports = globalErrorHandler;
