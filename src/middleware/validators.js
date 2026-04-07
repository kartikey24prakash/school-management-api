const { body, query, validationResult } = require("express-validator");

// ─── Reusable helper ──────────────────────────────────────────────────────────
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      success: false,
      message: "Validation failed",
      errors: errors.array().map((e) => ({
        field: e.path,
        message: e.msg,
        value: e.value,
      })),
    });
  }
  next();
};

// ─── Add School validators ────────────────────────────────────────────────────
const addSchoolValidators = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("School name is required")
    .isLength({ min: 2, max: 255 })
    .withMessage("School name must be between 2 and 255 characters"),

  body("address")
    .trim()
    .notEmpty()
    .withMessage("Address is required")
    .isLength({ min: 5, max: 500 })
    .withMessage("Address must be between 5 and 500 characters"),

  body("latitude")
    .notEmpty()
    .withMessage("Latitude is required")
    .isFloat({ min: -90, max: 90 })
    .withMessage("Latitude must be a number between -90 and 90"),

  body("longitude")
    .notEmpty()
    .withMessage("Longitude is required")
    .isFloat({ min: -180, max: 180 })
    .withMessage("Longitude must be a number between -180 and 180"),

  validate,
];

// ─── List Schools validators ──────────────────────────────────────────────────
const listSchoolsValidators = [
  query("latitude")
    .notEmpty()
    .withMessage("latitude query parameter is required")
    .isFloat({ min: -90, max: 90 })
    .withMessage("latitude must be a number between -90 and 90"),

  query("longitude")
    .notEmpty()
    .withMessage("longitude query parameter is required")
    .isFloat({ min: -180, max: 180 })
    .withMessage("longitude must be a number between -180 and 180"),

  validate,
];

module.exports = { addSchoolValidators, listSchoolsValidators };
