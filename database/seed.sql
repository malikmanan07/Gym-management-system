-- Seed Data for Gym Management System

USE gym_management;

-- Insert Membership Plans
INSERT INTO membership_plans (name, description, price, duration_months, status) VALUES
('Basic', 'Access to gym area only', 30.00, 1, 'active'),
('Premium', 'Access to gym + pool', 50.00, 1, 'active'),
('Elite', 'Full access + personal trainer', 100.00, 1, 'active'),
('Yearly Saver', 'Standard access for one year', 300.00, 12, 'active');

-- Insert Initial Admin (Password: admin123 - hashed version below)
-- Note: In production, use the hashing utility.
INSERT INTO users (username, email, password, role, full_name) VALUES
('admin', 'admin@gym.com', '$2a$10$X86L39sK7.J6Y5Uv.p9Yuef2Hn/z4nL5gVw8n8j6n8j6n8j6n8j6', 'admin', 'System Administrator');

-- Insert Sample Trainers
INSERT INTO users (username, email, password, role, full_name) VALUES
('trainer1', 'john@gym.com', '$2a$10$X86L39sK7.J6Y5Uv.p9Yuef2Hn/z4nL5gVw8n8j6n8j6n8j6n8j6', 'trainer', 'John Doe'),
('trainer2', 'jane@gym.com', '$2a$10$X86L39sK7.J6Y5Uv.p9Yuef2Hn/z4nL5gVw8n8j6n8j6n8j6n8j6', 'trainer', 'Jane Smith');

INSERT INTO trainers (user_id, specialization, experience_years, bio) VALUES
(2, 'Bodybuilding', 5, 'Certified pro bodybuilder'),
(3, 'Yoga & Pilates', 8, 'Expert in flexibility and core strength');

-- Insert Sample Members
INSERT INTO members (first_name, last_name, email, phone, gender, dob, address, status, joining_date) VALUES
('Mike', 'Ross', 'mike@example.com', '1234567890', 'male', '1995-05-10', '123 Wall St, NY', 'active', CURDATE()),
('Rachel', 'Zane', 'rachel@example.com', '0987654321', 'female', '1996-08-15', '456 Avenue St, NY', 'active', CURDATE());

-- Insert Member Subscriptions
INSERT INTO member_subscriptions (member_id, plan_id, start_date, end_date, status) VALUES
(1, 1, CURDATE(), DATE_ADD(CURDATE(), INTERVAL 1 MONTH), 'active'),
(2, 2, CURDATE(), DATE_ADD(CURDATE(), INTERVAL 1 MONTH), 'active');

-- Insert Sample Workout Plans
INSERT INTO workout_plans (name, goal, description, created_by) VALUES
('Beginner Full Body', 'Muscle Gain', '3 days a week full body workout', 1),
('Weight Loss Cardio', 'Fat Loss', 'Daily cardio and hiit', 1);

-- Insert Sample Diet Plans
INSERT INTO diet_plans (name, goal, description, created_by) VALUES
('High Protein', 'Bulking', 'High protein, moderate carbs', 1),
('Low Carb', 'Cutting', 'Keto-style diet', 1);
