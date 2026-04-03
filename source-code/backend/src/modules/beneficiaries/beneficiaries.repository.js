const { pool } = require("../../config/database");

const insertBeneficiary = async (row) => {
  const query = `
    INSERT INTO beneficiaries (
      account_id,
      beneficiary_name,
      beneficiary_account_number,
      ifsc_code,
      bank_name,
      nickname,
      status
    ) VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    row.account_id,
    row.beneficiary_name,
    row.beneficiary_account_number,
    row.ifsc_code ?? null,
    row.bank_name ?? null,
    row.nickname ?? null,
    row.status ?? "ACTIVE",
  ];

  const [result] = await pool.execute(query, values);
  return result.insertId;
};

const findBeneficiariesByAccountId = async (accountId) => {
  const query = `
    SELECT
      beneficiary_id,
      account_id,
      beneficiary_name,
      beneficiary_account_number,
      ifsc_code,
      bank_name,
      nickname,
      status,
      created_at,
      updated_at
    FROM beneficiaries
    WHERE account_id = ?
    ORDER BY beneficiary_id ASC
  `;
  const [rows] = await pool.execute(query, [accountId]);
  return rows;
};

const findBeneficiaryById = async (beneficiaryId) => {
  const query = `
    SELECT
      beneficiary_id,
      account_id,
      beneficiary_name,
      beneficiary_account_number,
      ifsc_code,
      bank_name,
      nickname,
      status,
      created_at,
      updated_at
    FROM beneficiaries
    WHERE beneficiary_id = ?
    LIMIT 1
  `;
  const [rows] = await pool.execute(query, [beneficiaryId]);
  return rows[0] || null;
};

module.exports = {
  insertBeneficiary,
  findBeneficiariesByAccountId,
  findBeneficiaryById,
};
