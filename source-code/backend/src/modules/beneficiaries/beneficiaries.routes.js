const express = require("express");

const validate = require("../../middlewares/validate.middleware");
const {
  createBeneficiaryHandler,
  listBeneficiariesByAccountIdHandler,
} = require("./beneficiaries.controller");
const { createBeneficiarySchema } = require("./beneficiaries.validation");

const router = express.Router();

router.post("/", validate(createBeneficiarySchema), createBeneficiaryHandler);
router.get("/account/:accountId", listBeneficiariesByAccountIdHandler);

module.exports = router;
