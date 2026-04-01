const asyncHandler = require("../../utils/async-handler");
const AppError = require("../../utils/app-error");
const { createCustomer, getCustomerById } = require("./customers.service");

const createCustomerHandler = asyncHandler(async (req, res) => {
  const customer = await createCustomer(req.body);

  res.status(201).json({
    success: true,
    message: "Customer created successfully",
    data: customer,
  });
});

const getCustomerByIdHandler = asyncHandler(async (req, res) => {
  const customerId = Number(req.params.customerId);

  if (!Number.isInteger(customerId) || customerId <= 0) {
    throw new AppError("Invalid customer id", 400);
  }

  const customer = await getCustomerById(customerId);

  res.status(200).json({
    success: true,
    data: customer,
  });
});

module.exports = {
  createCustomerHandler,
  getCustomerByIdHandler,
};
