-- ─────────────────────────────────────────────────────────────────────────────
-- School Management API — Database Schema
-- Run this script to set up the database manually (optional).
-- The API auto-creates the table on first startup.
-- ─────────────────────────────────────────────────────────────────────────────

-- 1. Create database
CREATE DATABASE IF NOT EXISTS school_management
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE school_management;

-- 2. Create schools table
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

-- 3. Seed sample data (optional)
INSERT INTO schools (name, address, latitude, longitude) VALUES
  ('Springfield Elementary',   '123 Main St, Springfield, IL 62701',         39.7817,  -89.6501),
  ('Shelbyville Middle School', '456 Elm Ave, Shelbyville, IL 62565',         39.4055,  -88.7993),
  ('Capital City High School',  '789 Oak Blvd, Capital City, IL 62701',       39.7980,  -89.6440),
  ('Ogdenville Academy',        '321 Maple Rd, Ogdenville, IL 60601',         41.8781,  -87.6298),
  ('North Haverbrook School',   '654 Pine St, North Haverbrook, IL 61602',    40.6936,  -89.5890);

SELECT 'Schema setup complete.' AS status;
