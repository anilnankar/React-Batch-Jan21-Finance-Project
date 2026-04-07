const { pool } = require("../../config/database");

const insertLoan = async (row) => {
  const query = `
    INSERT INTO loans (
      loan_account_number,
      loan_type_id,
      customer_id,
      linked_account_id,
      principal_amount,
      disbursed_amount,
      interest_rate_annual,
      tenure_months,
      start_date,
      end_date,
      loan_status
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    row.loan_account_number,
    row.loan_type_id,
    row.customer_id,
    row.linked_account_id ?? null,
    row.principal_amount,
    row.disbursed_amount ?? 0,
    row.interest_rate_annual,
    row.tenure_months,
    row.start_date ?? null,
    row.end_date ?? null,
    row.loan_status ?? "APPLIED",
  ];

  const [result] = await pool.execute(query, values);
  return result.insertId;
};

const findLoanById = async (loanId) => {
  const query = `
    SELECT
      loan_id,
      loan_account_number,
      loan_type_id,
      customer_id,
      linked_account_id,
      principal_amount,
      disbursed_amount,
      interest_rate_annual,
      tenure_months,
      start_date,
      end_date,
      loan_status,
      created_at,
      updated_at
    FROM loans
    WHERE loan_id = ?
    LIMIT 1
  `;
  const [rows] = await pool.execute(query, [loanId]);
  return rows[0] || null;
};

module.exports = {
  insertLoan,
  findLoanById,
};
