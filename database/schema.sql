-- Gym Management System Database Schema

CREATE DATABASE IF NOT EXISTS gym_management;
USE gym_management;

-- Users Table (Staff, Admins, Trainers)
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'staff', 'trainer') DEFAULT 'staff',
    full_name VARCHAR(100),
    phone VARCHAR(20),
    profile_image VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_user_role (role)
) ENGINE=InnoDB;

-- Membership Plans
CREATE TABLE IF NOT EXISTS membership_plans (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    duration_months INT NOT NULL,
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Members Table
CREATE TABLE IF NOT EXISTS members (
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE,
    phone VARCHAR(20) NOT NULL,
    gender ENUM('male', 'female', 'other'),
    dob DATE,
    address TEXT,
    profile_image VARCHAR(255),
    status ENUM('active', 'inactive', 'expired') DEFAULT 'active',
    joining_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_member_email (email),
    INDEX idx_member_status (status)
) ENGINE=InnoDB;

-- Member Subscription Details
CREATE TABLE IF NOT EXISTS member_subscriptions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    member_id INT NOT NULL,
    plan_id INT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status ENUM('active', 'expired', 'cancelled') DEFAULT 'active',
    FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE CASCADE,
    FOREIGN KEY (plan_id) REFERENCES membership_plans(id),
    INDEX idx_sub_member (member_id),
    INDEX idx_sub_status (status)
) ENGINE=InnoDB;

-- Attendance Table
CREATE TABLE IF NOT EXISTS attendance (
    id INT AUTO_INCREMENT PRIMARY KEY,
    member_id INT NOT NULL,
    date DATE NOT NULL,
    check_in TIME NOT NULL,
    check_out TIME,
    FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE CASCADE,
    INDEX idx_att_date (date),
    INDEX idx_att_member (member_id)
) ENGINE=InnoDB;

-- Payments Table
CREATE TABLE IF NOT EXISTS payments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    member_id INT NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    payment_method ENUM('cash', 'card', 'online') NOT NULL,
    payment_status ENUM('completed', 'pending', 'failed') DEFAULT 'completed',
    receipt_no VARCHAR(50) UNIQUE,
    FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE CASCADE,
    INDEX idx_pay_member (member_id),
    INDEX idx_pay_date (payment_date)
) ENGINE=InnoDB;

-- Trainers Extension (Linked to users)
CREATE TABLE IF NOT EXISTS trainers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL UNIQUE,
    specialization VARCHAR(100),
    experience_years INT,
    bio TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Trainer-Member Assignment
CREATE TABLE IF NOT EXISTS trainer_assignments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    trainer_id INT NOT NULL,
    member_id INT NOT NULL,
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (trainer_id) REFERENCES trainers(id) ON DELETE CASCADE,
    FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE CASCADE,
    UNIQUE(trainer_id, member_id)
) ENGINE=InnoDB;

-- Workout Plans
CREATE TABLE IF NOT EXISTS workout_plans (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    goal VARCHAR(100),
    description TEXT,
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- Diet Plans
CREATE TABLE IF NOT EXISTS diet_plans (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    goal VARCHAR(100),
    description TEXT,
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- Member Assigned Plans
CREATE TABLE IF NOT EXISTS member_plans (
    id INT AUTO_INCREMENT PRIMARY KEY,
    member_id INT NOT NULL,
    workout_plan_id INT,
    diet_plan_id INT,
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE CASCADE,
    FOREIGN KEY (workout_plan_id) REFERENCES workout_plans(id) ON DELETE SET NULL,
    FOREIGN KEY (diet_plan_id) REFERENCES diet_plans(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- Notifications
CREATE TABLE IF NOT EXISTS notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT, -- If NULL, it's for all staff/admins
    member_id INT, -- If specific to a member
    message TEXT NOT NULL,
    type ENUM('payment', 'expiry', 'attendance', 'system') NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE CASCADE
) ENGINE=InnoDB;
