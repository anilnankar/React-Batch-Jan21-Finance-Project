const asyncHandler = require("../../utils/async-handler");
const { getLoanDocuments, createLoanDocument } = require("./loans.service");

const createLoanDocumentHandler = asyncHandler(async (req, res) => {
  const loan = await createLoanDocument(req.body);
  res.status(201).json({
    success: true,
    message: "Loan document submitted",
    data: loan,
  });
});

const getLoanDocumentsHandler = asyncHandler(async (req, res) => { 
  const loanId = Number(req.params.loanId);

  if (!Number.isInteger(loanId) || loanId <= 0) {
    throw new AppError("Invalid loan id", 400);
  }

  
  // Placeholder for fetching loan documents
  const loanDocuments = await getLoanDocuments(loanId);

  res.status(200).json({
    success: true,
    message: "Loan documents fetched successfully",
    data: loanDocuments, // Replace with actual data when implemented
  });
});

module.exports = {
  createLoanDocumentHandler,
  getLoanDocumentsHandler
};
