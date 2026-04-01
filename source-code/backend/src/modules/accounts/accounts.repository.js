const { pool } = require("../../config/database");

const insertAccount = async (accountData, connection = null) => {
  const executor = connection || pool;
  const query = `
    INSERT INTO accounts (
      account_number,
      customer_id,
      account_type,
      currency_code,
      status,
      available_balance,
      ledger_balance
    ) VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    accountData.account_number,
    accountData.customer_id,
    accountData.account_type,
    accountData.currency_code,
    accountData.status,
    accountData.available_balance,
    accountData.ledger_balance,
  ];

  const [result] = await executor.execute(query, values);
  return result.insertId;
};

const findAccountsByCustomerId = async (customerId) => {
  const query = `
    SELECT
      account_id,
      account_number,
      customer_id,
      account_type,
      currency_code,
      status,
      available_balance,
      ledger_balance,
      created_at,
      updated_at
    FROM accounts
    WHERE customer_id = ?
    ORDER BY account_id ASC
  `;

  const [rows] = await pool.execute(query, [customerId]);
  return rows;
};

module.exports = {
  insertAccount,
  findAccountsByCustomerId,
};
