const asyncHandler = require("../../utils/async-handler");
const { createTransaction, getTractionsactionByCustomerId } = require("./transactions.service");

const createTransactionHandler = asyncHandler(async (req, res) => {
  const transaction = await createTransaction(req.body);

  res.status(201).json({
    success: true,
    message: "Payment recorded successfully",
    data: transaction,
  });
});

const getTractionsactionByCustomerIdHandler = asyncHandler(async (req, res) => {
  const { customerId } = req.params;
  const transactions = await getTractionsactionByCustomerId(customerId);  

  res.status(200).json({
    success: true,
    message: "Transactions retrieved successfully",
    data: transactions,
  });
});

module.exports = {
  createTransactionHandler,
  getTractionsactionByCustomerIdHandler
};
