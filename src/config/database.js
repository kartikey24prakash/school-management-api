const mysql = require("mysql2/promise");
require("dotenv").config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "school_management",
  waitForConnections: true,
  connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT) || 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
});

// Test connection on startup
const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log("✅  MySQL connected successfully");
    connection.release();
  } catch (error) {
    console.error("❌  MySQL connection failed:", error.message);
    process.exit(1);
  }
};

// Initialize database: create table if not exists
const initializeDatabase = async () => {
  const createTableSQL = `
    CREATE TABLE IF NOT EXISTS schools (
      id          INT           NOT NULL AUTO_INCREMENT,
      name        VARCHAR(255)  NOT NULL,
      address     VARCHAR(500)  NOT NULL,
      latitude    FLOAT         NOT NULL,
      longitude   FLOAT         NOT NULL,
      created_at  TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
      updated_at  TIMESTAMP     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      PRIMARY KEY (id),
      INDEX idx_location (latitude, longitude)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `;

  try {
    await pool.execute(createTableSQL);
    console.log("✅  Database table 'schools' is ready");
  } catch (error) {
    console.error("❌  Failed to initialize database table:", error.message);
    process.exit(1);
  }
};

module.exports = { pool, testConnection, initializeDatabase };
