const asyncHandler = require("../../utils/async-handler");
const { listActiveLoanTypes } = require("./loan-types.repository");

const listLoanTypesHandler = asyncHandler(async (_req, res) => {
  const rows = await listActiveLoanTypes();
  res.status(200).json({
    success: true,
    message: "Loan types loaded",
    data: rows,
  });
});

module.exports = {
  listLoanTypesHandler,
};
