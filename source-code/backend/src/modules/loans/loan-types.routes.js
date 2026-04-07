const express = require("express");

const { listLoanTypesHandler } = require("./loan-types.controller");

const router = express.Router();

router.get("/", listLoanTypesHandler);

module.exports = router;
