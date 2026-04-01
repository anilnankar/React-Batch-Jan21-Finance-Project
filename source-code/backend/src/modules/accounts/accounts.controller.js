const asyncHandler = require("../../utils/async-handler");
const { getAccountsByCustomerId } = require("./accounts.service");

const getAccountsByCustomerIdHandler = asyncHandler(async (req, res) => {
  const customerId = Number(req.params.customerId);

  if (!Number.isInteger(customerId) || customerId <= 0) {
    res.status(400).json({
      success: false,
      message: "Invalid customer id",
    });
    return;
  }

  const accounts = await getAccountsByCustomerId(customerId);

  res.status(200).json({
    success: true,
    data: accounts,
  });
});

module.exports = {
  getAccountsByCustomerIdHandler,
};
