const express = require("express");

const validate = require("../../middlewares/validate.middleware");
const { createLoanHandler, getLoansByCustomerIdHandler } = require("./loans.controller");
const { createLoanSchema } = require("./loans.validation");

const router = express.Router();

router.post("/", validate(createLoanSchema), createLoanHandler);
router.get("/customer/:customerId", getLoansByCustomerIdHandler);

module.exports = router;
