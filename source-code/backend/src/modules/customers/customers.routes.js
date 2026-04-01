const express = require("express");

const validate = require("../../middlewares/validate.middleware");
const { createCustomerHandler, getCustomerByIdHandler } = require("./customers.controller");
const { createCustomerSchema } = require("./customers.validation");

const router = express.Router();

router.post("/", validate(createCustomerSchema), createCustomerHandler);
router.get("/:customerId", getCustomerByIdHandler);

module.exports = router;
