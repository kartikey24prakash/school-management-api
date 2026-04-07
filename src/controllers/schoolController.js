const { pool } = require("../config/database");
const { calculateDistance } = require("../utils/distance");

// ─────────────────────────────────────────────────────────────────────────────
// POST /addSchool
// ─────────────────────────────────────────────────────────────────────────────
const addSchool = async (req, res) => {
  try {
    const { name, address, latitude, longitude } = req.body;

    // Check for duplicate school (same name + address)
    const [existing] = await pool.execute(
      "SELECT id FROM schools WHERE name = ? AND address = ?",
      [name.trim(), address.trim()]
    );

    if (existing.length > 0) {
      return res.status(409).json({
        success: false,
        message: "A school with the same name and address already exists",
        data: null,
      });
    }

    // Insert new school
    const [result] = await pool.execute(
      `INSERT INTO schools (name, address, latitude, longitude)
       VALUES (?, ?, ?, ?)`,
      [name.trim(), address.trim(), parseFloat(latitude), parseFloat(longitude)]
    );

    // Fetch the newly created record
    const [rows] = await pool.execute(
      "SELECT id, name, address, latitude, longitude, created_at FROM schools WHERE id = ?",
      [result.insertId]
    );

    return res.status(201).json({
      success: true,
      message: "School added successfully",
      data: rows[0],
    });
  } catch (error) {
    console.error("addSchool error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error while adding school",
      data: null,
    });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// GET /listSchools?latitude=XX&longitude=YY
// ─────────────────────────────────────────────────────────────────────────────
const listSchools = async (req, res) => {
  try {
    const userLat = parseFloat(req.query.latitude);
    const userLon = parseFloat(req.query.longitude);

    // Fetch all schools
    const [schools] = await pool.execute(
      "SELECT id, name, address, latitude, longitude, created_at FROM schools"
    );

    if (schools.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No schools found in the database",
        userLocation: { latitude: userLat, longitude: userLon },
        total: 0,
        data: [],
      });
    }

    // Calculate distance for each school and sort ascending
    const schoolsWithDistance = schools
      .map((school) => ({
        ...school,
        distance_km: calculateDistance(
          userLat,
          userLon,
          school.latitude,
          school.longitude
        ),
      }))
      .sort((a, b) => a.distance_km - b.distance_km);

    return res.status(200).json({
      success: true,
      message: "Schools retrieved and sorted by proximity",
      userLocation: { latitude: userLat, longitude: userLon },
      total: schoolsWithDistance.length,
      data: schoolsWithDistance,
    });
  } catch (error) {
    console.error("listSchools error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error while fetching schools",
      data: null,
    });
  }
};

module.exports = { addSchool, listSchools };
