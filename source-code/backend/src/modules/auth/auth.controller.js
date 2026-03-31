const asyncHandler = require("../../utils/async-handler");
const { loginCustomer } = require("./auth.service");

const loginHandler = asyncHandler(async (req, res) => {
  const customer = await loginCustomer(req.body);

  res.status(200).json({
    success: true,
    message: "Login successful",
    data: customer,
  });
});

module.exports = {
  loginHandler,
};
