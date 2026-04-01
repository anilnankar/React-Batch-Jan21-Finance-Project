const express = require("express");
const { getAccountsByCustomerIdHandler } = require("./accounts.controller");

const router = express.Router();

router.get("/customer/:customerId", getAccountsByCustomerIdHandler);

module.exports = router;
