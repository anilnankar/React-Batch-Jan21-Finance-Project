const AppError = require("../../utils/app-error");
const {
  insertCustomer,
  findCustomerById,
} = require("./customers.repository");

const buildCustomerCode = () =>
  `CUST${Date.now()}${Math.floor(Math.random() * 1000)}`;

const mapDatabaseError = (error) => {
  if (error && error.code === "ER_DUP_ENTRY") {
    if (error.message.includes("uq_customers_pan")) {
      return new AppError("PAN number already exists", 409);
    }
    if (error.message.includes("uq_customers_mobile")) {
      return new AppError("Mobile number already exists", 409);
    }
    if (error.message.includes("uq_customers_code")) {
      return new AppError("Customer code conflict, retry request", 409);
    }
    return new AppError("Duplicate value found", 409);
  }

  return new AppError("Database operation failed", 500);
};

const createCustomer = async (payload) => {
  const customerData = {
    ...payload,
    customer_code: buildCustomerCode(),
  };

  try {
    const customerId = await insertCustomer(customerData);
    return findCustomerById(customerId);
  } catch (error) {
    throw mapDatabaseError(error);
  }
};

module.exports = {
  createCustomer,
};
