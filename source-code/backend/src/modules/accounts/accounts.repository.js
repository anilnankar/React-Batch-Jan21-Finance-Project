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

const findAccountById = async (accountId) => {
  const query = `
    SELECT account_id
    FROM accounts
    WHERE account_id = ?
    LIMIT 1
  `;
  const [rows] = await pool.execute(query, [accountId]);
  return rows[0] || null;
};

const findAccountWithCustomer = async (accountId) => {
  const query = `
    SELECT
      account_id,
      customer_id,
      status,
      available_balance,
      currency_code
    FROM accounts
    WHERE account_id = ?
    LIMIT 1
  `;
  const [rows] = await pool.execute(query, [accountId]);
  return rows[0] || null;
};

const decreaseAvailableBalance = async (accountId, amount, connection = null) => {
  const executor = connection || pool;
  const query = `
    UPDATE accounts
    SET available_balance = available_balance - ?
    WHERE account_id = ?
      AND status = 'ACTIVE'
      AND available_balance >= ?
  `;
  const [result] = await executor.execute(query, [amount, accountId, amount]);
  return result.affectedRows;
};

const findAccountByAccountNumber = async (accountNumber, connection = null) => {
  const executor = connection || pool;
  const trimmed = String(accountNumber || "").trim();
  if (!trimmed) {
    return null;
  }
  const query = `
    SELECT account_id, status, currency_code
    FROM accounts
    WHERE account_number = ?
    LIMIT 1
  `;
  const [rows] = await executor.execute(query, [trimmed]);
  return rows[0] || null;
};

const increaseAvailableBalance = async (accountId, amount, connection = null) => {
  const executor = connection || pool;
  const query = `
    UPDATE accounts
    SET available_balance = available_balance + ?
    WHERE account_id = ?
      AND status = 'ACTIVE'
  `;
  const [result] = await executor.execute(query, [amount, accountId]);
  return result.affectedRows;
};

module.exports = {
  insertAccount,
  findAccountsByCustomerId,
  findAccountById,
  findAccountWithCustomer,
  decreaseAvailableBalance,
  findAccountByAccountNumber,
  increaseAvailableBalance,
};
