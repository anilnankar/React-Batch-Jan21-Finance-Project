const express = require("express");

const { apiRateLimiter } = require("../../config/rate-limit");
const customerRoutes = require("../../modules/customers/customers.routes");
const accountsRoutes = require("../../modules/accounts/accounts.routes");
const beneficiariesRoutes = require("../../modules/beneficiaries/beneficiaries.routes");
const transactionsRoutes = require("../../modules/transactions/transactions.routes");
const authRoutes = require("../../modules/auth/auth.routes");

const router = express.Router();

router.use(apiRateLimiter);
router.use("/customers", customerRoutes);
router.use("/customer", customerRoutes);
router.use("/accounts", accountsRoutes);
router.use("/beneficiaries", beneficiariesRoutes);
router.use("/transactions", transactionsRoutes);
router.use("/", authRoutes);

module.exports = router;
