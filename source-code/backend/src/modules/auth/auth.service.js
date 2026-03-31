const AppError = require("../../utils/app-error");
const { findCustomerByEmailAndPassword } = require("./auth.repository");

const loginCustomer = async (payload) => {
  const customer = await findCustomerByEmailAndPassword(payload);

  if (!customer) {
    throw new AppError("Invalid email or password", 401);
  }

  return customer;
};

module.exports = {
  loginCustomer,
};
