const AppError = require("../../utils/app-error");
const env = require("../../config/env");
const { pool } = require("../../config/database");
const { insertAccount } = require("../accounts/accounts.repository");
const {
  insertCustomer,
  findCustomerById,
} = require("./customers.repository");

const buildCustomerCode = () =>
  `CUST${Date.now()}${Math.floor(Math.random() * 1000)}`;

const buildAccountNumber = () =>
  `ACC${Date.now()}${Math.floor(Math.random() * 1000)}`;

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
    if (error.message.includes("uq_accounts_number")) {
      return new AppError("Account number conflict, retry request", 409);
    }
    return new AppError("Duplicate value found", 409);
  }

  const sqlHint =
    env.nodeEnv === "development" && error && (error.sqlMessage || error.message)
      ? ` (${error.sqlMessage || error.message})`
      : "";
  return new AppError(`Database operation failed${sqlHint}`, 500);
};

const createCustomer = async (payload) => {
  const { account_type, ...customerFields } = payload;
  const customerData = {
    ...customerFields,
    customer_code: buildCustomerCode(),
  };

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const customerId = await insertCustomer(customerData, connection);
    await insertAccount(
      {
        account_number: buildAccountNumber(),
        customer_id: customerId,
        account_type,
        currency_code: "INR",
        status: "INACTIVE",
        available_balance: 5000,
        ledger_balance: 0,
      },
      connection
    );
    await connection.commit();
    return findCustomerById(customerId);
  } catch (error) {
    await connection.rollback();
    throw mapDatabaseError(error);
  } finally {
    connection.release();
  }
};

const getCustomerById = async (customerId) => {
  const customer = await findCustomerById(customerId);
  if (!customer) {
    throw new AppError("Customer not found", 404);
  }
  return customer;
};

module.exports = {
  createCustomer,
  getCustomerById,
};
