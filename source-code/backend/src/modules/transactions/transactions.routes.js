const express = require("express");

const validate = require("../../middlewares/validate.middleware");
const { createTransactionHandler, getTractionsactionByCustomerIdHandler } = require("./transactions.controller");
const { createTransactionSchema } = require("./transactions.validation");

const router = express.Router();

router.get("/:customerId", getTractionsactionByCustomerIdHandler);
router.post("/", validate(createTransactionSchema), createTransactionHandler);

module.exports = router;
