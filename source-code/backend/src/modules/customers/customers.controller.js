const asyncHandler = require("../../utils/async-handler");
const { createCustomer } = require("./customers.service");

const createCustomerHandler = asyncHandler(async (req, res) => {
  const customer = await createCustomer(req.body);

  res.status(201).json({
    success: true,
    message: "Customer created successfully",
    data: customer,
  });
});

module.exports = {
  createCustomerHandler,
};
