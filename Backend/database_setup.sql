-- Knapsack Database Setup Script
-- Run this script to create the database and tables

-- Create database
CREATE DATABASE IF NOT EXISTS knapsack CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Use the database
USE knapsack;

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(120) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Verify table creation
SHOW TABLES;

-- Create knapsack_problems table
CREATE TABLE IF NOT EXISTS knapsack_problems (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    items TEXT NOT NULL COMMENT 'JSON array of items with id, weight, value',
    capacity FLOAT NOT NULL,
    algorithm_type VARCHAR(50) NOT NULL COMMENT 'dp_01, greedy, or fractional',
    solution TEXT COMMENT 'JSON object with selected_items, total_weight, total_value, steps',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_user_id (user_id),
    INDEX idx_created_at (created_at),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Verify table creation
SHOW TABLES;

-- Display table structures
DESCRIBE users;
DESCRIBE knapsack_problems;

