const asyncHandler = require("../../utils/async-handler");
const { createTransaction } = require("./transactions.service");

const createTransactionHandler = asyncHandler(async (req, res) => {
  const transaction = await createTransaction(req.body);

  res.status(201).json({
    success: true,
    message: "Payment recorded successfully",
    data: transaction,
  });
});

module.exports = {
  createTransactionHandler,
};
