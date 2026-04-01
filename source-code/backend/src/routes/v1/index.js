const express = require("express");

const { apiRateLimiter } = require("../../config/rate-limit");
const healthRoutes = require("../../modules/health/health.routes");
const customerRoutes = require("../../modules/customers/customers.routes");
const accountsRoutes = require("../../modules/accounts/accounts.routes");
const authRoutes = require("../../modules/auth/auth.routes");

const router = express.Router();

router.use(apiRateLimiter);
router.use("/health", healthRoutes);
router.use("/customers", customerRoutes);
router.use("/customer", customerRoutes);
router.use("/accounts", accountsRoutes);
router.use("/", authRoutes);

module.exports = router;
