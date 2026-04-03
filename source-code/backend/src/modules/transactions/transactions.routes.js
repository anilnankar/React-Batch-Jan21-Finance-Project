const express = require("express");

const validate = require("../../middlewares/validate.middleware");
const { createTransactionHandler } = require("./transactions.controller");
const { createTransactionSchema } = require("./transactions.validation");

const router = express.Router();

router.post("/", validate(createTransactionSchema), createTransactionHandler);

module.exports = router;
