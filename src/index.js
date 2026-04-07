require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { testConnection, initializeDatabase } = require("./config/database");
const schoolRoutes = require("./routes/schoolRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

// ─── Global Middleware ────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logger (development)
if (process.env.NODE_ENV !== "production") {
  app.use((req, _res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
    next();
  });
}

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "School Management API is running",
    version: "1.0.0",
    endpoints: {
      addSchool: "POST /addSchool",
      listSchools: "GET /listSchools?latitude={lat}&longitude={lon}",
    },
  });
});

app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    status: "healthy",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// ─── API Routes ───────────────────────────────────────────────────────────────
app.use("/", schoolRoutes);

// ─── 404 Handler ─────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found`,
  });
});

// ─── Global Error Handler ────────────────────────────────────────────────────
app.use((err, req, res, _next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({
    success: false,
    message: "An unexpected error occurred",
    ...(process.env.NODE_ENV !== "production" && { error: err.message }),
  });
});

// ─── Boot ─────────────────────────────────────────────────────────────────────
const startServer = async () => {
  await testConnection();
  await initializeDatabase();

  app.listen(PORT, () => {
    console.log(`\n🚀  School Management API`);
    console.log(`   Listening on: http://localhost:${PORT}`);
    console.log(`   Environment:  ${process.env.NODE_ENV || "development"}`);
    console.log(`\n📌  Endpoints:`);
    console.log(`   POST http://localhost:${PORT}/addSchool`);
    console.log(`   GET  http://localhost:${PORT}/listSchools?latitude=XX&longitude=YY\n`);
  });
};

startServer().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});

module.exports = app;
