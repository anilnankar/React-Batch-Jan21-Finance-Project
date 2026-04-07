const asyncHandler = require("../../utils/async-handler");
const { createLoan, getLoansByCustomerId } = require("./loans.service");

const createLoanHandler = asyncHandler(async (req, res) => {
  const loan = await createLoan(req.body);
  res.status(201).json({
    success: true,
    message: "Loan application submitted",
    data: loan,
  });
});

const getLoansByCustomerIdHandler = asyncHandler(async (req, res) => {
  const customerId = Number(req.params.customerId);

  if (!Number.isInteger(customerId) || customerId <= 0) {
    res.status(400).json({
      success: false,
      message: "Invalid customer id",
    });
    return;
  }

  const loans = await getLoansByCustomerId(customerId);

  res.status(200).json({
    success: true,
    data: loans,
  });
});

module.exports = {
  createLoanHandler,
  getLoansByCustomerIdHandler,
};
