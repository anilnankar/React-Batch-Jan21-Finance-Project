const { pool } = require("../../config/database");

const insertCustomer = async (customerData) => {
  const query = `
    INSERT INTO customers (
      customer_code,
      customer_type,
      full_name,
      date_of_birth_or_incorp,
      mobile_number,
      email,
      pan_number
    ) VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    customerData.customer_code,
    customerData.customer_type,
    customerData.full_name,
    customerData.date_of_birth_or_incorp || null,
    customerData.mobile_number,
    customerData.email || null,
    customerData.pan_number,
  ];

  const [result] = await pool.execute(query, values);
  return result.insertId;
};

const findCustomerById = async (customerId) => {
  const query = `
    SELECT
      customer_id,
      customer_code,
      customer_type,
      full_name,
      date_of_birth_or_incorp,
      mobile_number,
      email,
      pan_number,
      kyc_status,
      risk_category,
      status,
      created_at,
      updated_at
    FROM customers
    WHERE customer_id = ?
    LIMIT 1
  `;

  const [rows] = await pool.execute(query, [customerId]);
  return rows[0] || null;
};

module.exports = {
  insertCustomer,
  findCustomerById,
};
