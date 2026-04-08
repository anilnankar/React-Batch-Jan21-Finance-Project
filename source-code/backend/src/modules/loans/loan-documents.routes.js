const express = require("express");

const { createLoanDocumentHandler } = require("./loan-documents.controller");

const router = express.Router();

router.post("/", createLoanDocumentHandler);

module.exports = router;
