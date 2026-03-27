const express = require("express");

const { apiRateLimiter } = require("../../config/rate-limit");
const healthRoutes = require("../../modules/health/health.routes");

const router = express.Router();

router.use(apiRateLimiter);
router.use("/health", healthRoutes);

module.exports = router;
