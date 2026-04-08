const { pool } = require("../../config/database");

const insertLoanDocument = async (row) => {
  const query = `
    INSERT INTO loan_documents (
      loan_id,
      document_type,
      document_file,
      status
    ) VALUES (?, ?, ?, ?)
  `;

  const values = [
    row.loan_id,
    row.document_type,
    row.document_file,
    row.status ?? "Pending",
  ];

  const [result] = await pool.execute(query, values);
  return result.insertId;
};

module.exports = {
  insertLoanDocument
};
