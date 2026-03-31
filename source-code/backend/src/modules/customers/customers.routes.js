const express = require("express");

const validate = require("../../middlewares/validate.middleware");
const { createCustomerHandler } = require("./customers.controller");
const { createCustomerSchema } = require("./customers.validation");

const router = express.Router();

router.post("/", validate(createCustomerSchema), createCustomerHandler);

module.exports = router;
