const asyncHandler = require("../../utils/async-handler");
const { createLoan } = require("./loans.service");

const createLoanHandler = asyncHandler(async (req, res) => {
  const loan = await createLoan(req.body);
  res.status(201).json({
    success: true,
    message: "Loan application submitted",
    data: loan,
  });
});

module.exports = {
  createLoanHandler,
};
