const express = require("express");

const validate = require("../../middlewares/validate.middleware");
const { createLoanHandler } = require("./loans.controller");
const { createLoanSchema } = require("./loans.validation");

const router = express.Router();

router.post("/", validate(createLoanSchema), createLoanHandler);

module.exports = router;
