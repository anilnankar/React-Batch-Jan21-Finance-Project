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

const findLoanDocuments = async (loanId) => {
  const query = `
    SELECT document_id, loan_id, document_type, document_file, status, verified_datetime, created_datetime
    FROM loan_documents
    WHERE loan_id = ?
  `;
  const [rows] = await pool.execute(query, [loanId]);
  return rows;
};

module.exports = {
  insertLoanDocument,
  findLoanDocuments
};
