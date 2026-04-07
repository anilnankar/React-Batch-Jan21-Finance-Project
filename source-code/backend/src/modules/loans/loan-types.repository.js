const { pool } = require("../../config/database");

const listActiveLoanTypes = async () => {
  const query = `
    SELECT
      loan_type_id,
      loan_type,
      roi,
      min_tenure,
      max_tenure,
      status,
      created_date,
      updated_date
    FROM loan_types
    WHERE status = 'ACTIVE'
    ORDER BY loan_type_id ASC
  `;
  const [rows] = await pool.execute(query);
  return rows;
};

const findLoanTypeById = async (loanTypeId) => {
  const query = `
    SELECT
      loan_type_id,
      loan_type,
      roi,
      min_tenure,
      max_tenure,
      status,
      created_date,
      updated_date
    FROM loan_types
    WHERE loan_type_id = ?
    LIMIT 1
  `;
  const [rows] = await pool.execute(query, [loanTypeId]);
  return rows[0] || null;
};

module.exports = {
  listActiveLoanTypes,
  findLoanTypeById,
};
