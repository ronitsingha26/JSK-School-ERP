-- ============================================
-- JSK SCHOOL ERP — DATABASE SCHEMA
-- JSK Educational & Social Welfare Foundation
-- Pratapganj, Bihar
-- ============================================

-- Create Database
CREATE DATABASE IF NOT EXISTS jsk_school_erp
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE jsk_school_erp;

-- ─────────────────────────────────────────────
-- USERS TABLE
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin', 'teacher', 'accountant', 'librarian', 'receptionist', 'principal') DEFAULT 'teacher',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  INDEX idx_email (email),
  INDEX idx_role (role),
  INDEX idx_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─────────────────────────────────────────────
-- DEFAULT ADMIN USER
-- Password: Admin@123 (hashed via Sequelize hooks at runtime)
-- ─────────────────────────────────────────────
-- Note: The admin user is auto-seeded by server.js on first run.
-- If running this SQL directly, use the following (generate your own bcrypt hash):
INSERT INTO users (name, email, password, role, is_active)
VALUES (
  'Super Admin',
  'admin@jsk.com',
  '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
  'admin',
  TRUE
)
ON DUPLICATE KEY UPDATE name = name;
