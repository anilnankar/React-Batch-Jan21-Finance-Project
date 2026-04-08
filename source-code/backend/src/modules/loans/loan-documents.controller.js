const asyncHandler = require("../../utils/async-handler");
const { createLoanDocument } = require("./loans.service");

const createLoanDocumentHandler = asyncHandler(async (req, res) => {
  const loan = await createLoanDocument(req.body);
  res.status(201).json({
    success: true,
    message: "Loan document submitted",
    data: loan,
  });
});

module.exports = {
  createLoanDocumentHandler
};
