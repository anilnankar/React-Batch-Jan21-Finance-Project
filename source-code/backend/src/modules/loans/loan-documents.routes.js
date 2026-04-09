const express = require("express");

const { getLoanDocumentsHandler, createLoanDocumentHandler } = require("./loan-documents.controller");

const router = express.Router();

router.get("/:loanId", getLoanDocumentsHandler);
router.post("/", createLoanDocumentHandler);

module.exports = router;
