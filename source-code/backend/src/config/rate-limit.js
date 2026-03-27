const rateLimit = require("express-rate-limit");

const env = require("./env");

const apiRateLimiter = rateLimit({
  windowMs: env.apiRateLimitWindowMs,
  max: env.apiRateLimitMax,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: "Too many requests from this IP, please try again later.",
  },
});

module.exports = {
  apiRateLimiter,
};
