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

const findTransactionByCustomerId = async (customerId, connection = null) => {
  const executor = connection || pool;

  const query1 = `
    SELECT
      account_id,
      account_number,
      customer_id
    FROM accounts
    WHERE customer_id = ?
    ORDER BY created_at DESC  
  `;
  const [accountRow] = await executor.execute(query1, [customerId]);

  const query = `
    SELECT
      t.transaction_id,
      t.customer_id,
      t.from_account_id,
      t.beneficiary_id,
      t.amount,
      t.currency_code,
      t.transaction_type,
      t.status,
      t.payment_channel,  
      t.remarks,
      t.created_at,
      t.updated_at,
      b.beneficiary_name,
      b.beneficiary_account_number
    FROM transactions as t
    LEFT JOIN beneficiaries as b ON t.beneficiary_id = b.beneficiary_id   
    WHERE 
    (t.from_account_id = ? OR t.beneficiary_id = ?)
    ORDER BY created_at DESC  
  `;
  // console.log("Executing query to find transactions for account_id:", accountRow[0].account_id);
  const [rows] = await executor.execute(query, [accountRow[0].account_id, accountRow[0].account_id]);
  return rows;
};

module.exports = {
  insertTransaction,
  findTransactionById,
  findTransactionByCustomerId
};
