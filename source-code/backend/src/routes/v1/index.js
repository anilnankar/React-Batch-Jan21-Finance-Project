const express = require("express");

const { apiRateLimiter } = require("../../config/rate-limit");
const customerRoutes = require("../../modules/customers/customers.routes");
const accountsRoutes = require("../../modules/accounts/accounts.routes");
const beneficiariesRoutes = require("../../modules/beneficiaries/beneficiaries.routes");
const transactionsRoutes = require("../../modules/transactions/transactions.routes");
const loanTypesRoutes = require("../../modules/loans/loan-types.routes");
const loansRoutes = require("../../modules/loans/loans.routes");
const authRoutes = require("../../modules/auth/auth.routes");

const router = express.Router();

router.use(apiRateLimiter);
router.use("/customers", customerRoutes);
router.use("/customer", customerRoutes);
router.use("/accounts", accountsRoutes);
router.use("/beneficiaries", beneficiariesRoutes);
router.use("/transactions", transactionsRoutes);
router.use("/loan-types", loanTypesRoutes);
router.use("/loans", loansRoutes);
router.use("/", authRoutes);

module.exports = router;
