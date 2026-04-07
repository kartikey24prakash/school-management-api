const mysql = require("mysql2/promise");
require("dotenv").config();

const connectionUri = process.env.DATABASE_URL || process.env.MYSQL_URL;
const sslEnabled =
  process.env.DB_SSL === "true" || process.env.MYSQL_SSL === "true";

const poolConfig = connectionUri
  ? {
      uri: connectionUri,
    }
  : {
      host: process.env.DB_HOST || process.env.MYSQLHOST || "localhost",
      port:
        parseInt(process.env.DB_PORT || process.env.MYSQLPORT, 10) || 3306,
      user: process.env.DB_USER || process.env.MYSQLUSER || "root",
      password: process.env.DB_PASSWORD || process.env.MYSQLPASSWORD || "",
      database:
        process.env.DB_NAME || process.env.MYSQLDATABASE || "school_management",
    };

const pool = mysql.createPool({
  ...poolConfig,
  waitForConnections: true,
  connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT, 10) || 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
  ...(sslEnabled
    ? {
        ssl: {
          rejectUnauthorized:
            process.env.DB_SSL_REJECT_UNAUTHORIZED !== "false",
        },
      }
    : {}),
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
