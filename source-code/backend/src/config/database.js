const mysql = require("mysql2/promise");

const env = require("./env");

const pool = mysql.createPool({
  host: env.dbHost,
  port: env.dbPort,
  user: env.dbUser,
  password: env.dbPassword,
  database: env.dbName,
  connectionLimit: env.dbPoolLimit,
  waitForConnections: true,
  queueLimit: 0,
});

const checkDatabaseConnection = async () => {
  const connection = await pool.getConnection();
  try {
    await connection.query("SELECT 1");
  } finally {
    connection.release();
  }
};

module.exports = {
  pool,
  checkDatabaseConnection,
};
