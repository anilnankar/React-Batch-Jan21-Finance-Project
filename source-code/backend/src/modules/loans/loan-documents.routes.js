const express = require("express");

const { listLoanDocumentsHandler } = require("./loan-documents.controller");

const router = express.Router();

router.get("/", listLoanDocumentsHandler);

module.exports = router;
