const { pool } = require("../../config/database");

const insertTransaction = async (row, connection = null) => {
  const executor = connection || pool;
  const query = `
    INSERT INTO transactions (
      customer_id,
      from_account_id,
      beneficiary_id,
      amount,
      currency_code,
      transaction_type,
      status,
      payment_channel,
      remarks
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    row.customer_id,
    row.from_account_id,
    row.beneficiary_id,
    row.amount,
    row.currency_code ?? "INR",
    row.transaction_type ?? "PAYMENT",
    row.status ?? "COMPLETED",
    row.payment_channel ?? "NETBANKING",
    row.remarks ?? null,
  ];

  const [result] = await executor.execute(query, values);
  return result.insertId;
};

const findTransactionById = async (transactionId) => {
  const query = `
    SELECT
      transaction_id,
      customer_id,
      from_account_id,
      beneficiary_id,
      amount,
      currency_code,
      transaction_type,
      status,
      payment_channel,
      remarks,
      created_at,
      updated_at
    FROM transactions
    WHERE transaction_id = ?
    LIMIT 1
  `;
  const [rows] = await pool.execute(query, [transactionId]);
  return rows[0] || null;
};

module.exports = {
  insertTransaction,
  findTransactionById,
};
