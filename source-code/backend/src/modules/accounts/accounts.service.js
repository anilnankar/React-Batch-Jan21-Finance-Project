const { findAccountsByCustomerId } = require("./accounts.repository");

const getAccountsByCustomerId = async (customerId) => {
  return findAccountsByCustomerId(customerId);
};

module.exports = {
  getAccountsByCustomerId,
};
