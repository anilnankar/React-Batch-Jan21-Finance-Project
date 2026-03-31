const { pool } = require("../../config/database");

const findCustomerByEmailAndPassword = async ({ email, password }) => {
  const query = `
    SELECT
      customer_id,
      customer_code,
      full_name,
      email,
      mobile_number,
      status
    FROM customers
    WHERE email = ?
      AND password = MD5(?)
    LIMIT 1
  `;

  const [rows] = await pool.execute(query, [email, password]);
  return rows[0] || null;
};

module.exports = {
  findCustomerByEmailAndPassword,
};
