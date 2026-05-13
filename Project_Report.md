# FlexGym Management System - Comprehensive Project Report

## 1. Project Overview
FlexGym Management System is a modern, full-stack web application designed to streamline the operations of a fitness center. It provides gym administrators with a centralized dashboard to manage members, track daily attendance, process financial transactions, assign personalized diet/workout plans, and manage trainer assignments.

## 2. Technology Stack
- **Frontend:** React.js (Vite), React Bootstrap, Lucide Icons, Recharts (for analytics).
- **Backend:** Node.js, Express.js.
- **Database:** MySQL.
- **ORM:** Sequelize (with `paranoid: true` for soft deletes).
- **Validation:** Zod (for robust payload validation).
- **Security:** JWT (JSON Web Tokens) for authentication, bcrypt for password hashing.

## 3. System Architecture
The system follows a standard Client-Server architecture:
1. **Presentation Layer (Frontend):** React components communicating via Axios interceptors. It handles UI/UX, routing, and token injection.
2. **Business Logic Layer (Backend Services):** Express controllers delegate complex operations to dedicated Service classes (`DashboardService`, `PaymentService`, etc.) ensuring separation of concerns.
3. **Data Access Layer (ORM):** Sequelize models with predefined associations and cascading delete rules manage database interactions.

## 4. Core Modules & Features
- **Authentication & Authorization:** Secure login system. Only authorized personnel (Admin, Staff) can access the system.
- **Dashboard Analytics:** Real-time data visualization showing Total Members, Active Members, Monthly Revenue, and Today's Attendance. Includes revenue charts calculated dynamically using ORM functions.
- **Member Management:** Create, read, update, and soft-delete member records.
- **Attendance Terminal:** Quick check-in/check-out system using Member IDs. Logs are strictly tracked by date.
- **Financial Ledger (Payments):** Track all payments (Cash, Card, Transfer). Mapped directly to members.
- **Trainer Management:** Track gym trainers, their specializations, and assignments.
- **Fitness Plans:** Assign specific Workout and Diet plans to members.

## 5. Comprehensive Database Design (Schema & Relations)
The database (`gym_management`) is fully normalized. It utilizes snake_case for database column names, which are securely mapped to camelCase in the application layer to prevent mapping errors.

### 5.1 Tables and Attributes

#### `users` (System Administrators / Staff)
- `id` (INT, PK, Auto Increment)
- `username` (VARCHAR, Unique, Not Null)
- `email` (VARCHAR, Unique, Not Null)
- `password` (VARCHAR, Hashed)
- `role` (ENUM: 'admin', 'staff', 'trainer')
- `full_name`, `phone`, `profile_image` (VARCHAR)
- *Timestamps:* `created_at`, `updated_at`, `deleted_at`

#### `members` (Gym Customers)
- `id` (INT, PK)
- `first_name`, `last_name` (VARCHAR, Not Null)
- `email` (VARCHAR, Unique)
- `phone` (VARCHAR, Unique, Not Null)
- `gender` (ENUM: 'male', 'female', 'other')
- `status` (ENUM: 'active', 'inactive', 'expired')
- `workout_plan_id` (INT, FK -> workout_plans.id, ON DELETE SET NULL)
- `diet_plan_id` (INT, FK -> diet_plans.id, ON DELETE SET NULL)
- *Timestamps:* `created_at`, `updated_at`, `deleted_at`

#### `attendance` (Daily Check-ins)
- `id` (INT, PK)
- `member_id` (INT, FK -> members.id, ON DELETE CASCADE)
- `date` (DATE, Not Null)
- `check_in` (TIME, Not Null - Stored in 24-hour format HH:mm:ss)
- `check_out` (TIME, Nullable)
- *Timestamps:* `created_at`, `updated_at`, `deleted_at`

#### `payments` (Financial Transactions)
- `id` (INT, PK)
- `member_id` (INT, FK -> members.id, ON DELETE CASCADE)
- `amount` (DECIMAL 10,2, Not Null)
- `payment_date` (DATE, Default CURRENT_DATE)
- `payment_method` (STRING, e.g., 'cash', 'card', 'transfer')
- `payment_status` (ENUM: 'completed', 'pending', 'failed')
- *Timestamps:* `created_at`, `updated_at`, `deleted_at`

#### `trainers`
- `id` (INT, PK)
- `full_name` (VARCHAR, Not Null)
- `email`, `phone` (VARCHAR, Unique)
- `specialization` (VARCHAR)
- `experience_years` (INT)
- `status` (ENUM: 'active', 'inactive')
- *Timestamps:* `created_at`, `updated_at`, `deleted_at`

#### `workout_plans` & `diet_plans`
- `id` (INT, PK)
- `name` (VARCHAR)
- `description` (TEXT)
- `difficulty` / `goal` (ENUM)
- `exercises` / `meals` (JSON type for flexible structure)

### 5.2 Key Relationships & Constraints
1. **Member to Attendance (1:N):** A member can have multiple attendance logs. If a member is deleted, their attendance history is completely wiped (`CASCADE`) to avoid orphaned records.
2. **Member to Payment (1:N):** A member can have multiple payments. Deleted members cascade to payments (`CASCADE`).
3. **Member to Plans (N:1):** Many members can follow one Workout or Diet plan. If a plan is deleted, the member's plan assignment is gracefully set to `NULL` (`SET NULL`) so the member record stays intact.
4. **Soft Deletes (Paranoid Mode):** Almost all tables include a `deleted_at` column. When a record (e.g., Payment) is "deleted" from the UI, it is not erased from the DB. Instead, `deleted_at` is populated. The Sequelize ORM automatically filters these out in all queries to preserve historical analytics without breaking real-time calculations.

## 6. API & Data Flow
- **Data Transfer Objects (DTOs):** All outgoing data is formatted through DTOs. For example, `AttendanceDTO` converts the strict 24-hour database time to a user-friendly 12-hour AM/PM format for the frontend UI.
- **Zod Middleware Validation:** Intercepts incoming requests. For example, when creating a payment, Zod verifies that `memberId` is a positive integer and `paymentMethod` is a valid string before hitting the database, preventing fatal server crashes.

## 7. Conclusion
The FlexGym Management System provides a highly resilient, normalized, and scalable foundation. By utilizing strict foreign key constraints, robust camelCase-to-snake_case mapping, dynamic ORM queries, and foolproof error-handling middleware, the software guarantees structural integrity and real-time analytics synchronization across the entire platform.
