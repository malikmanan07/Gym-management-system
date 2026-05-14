# Gym Management System - Professional Athlete Directory

A modern, secure, and professional management system built with **React**, **Node.js**, **Express**, and **MySQL**.

## 🚀 Professional Features
- **Secure Authentication:** JWT-based login with **Bcrypt** password hashing.
- **Athlete Directory:** Advanced Member CRUD with **Professional Status Deactivation**.
- **Financial Intelligence:** Revenue tracking that persists even after member deactivation (Business Standard).
- **Attendance Tracking:** Real-time check-in/out logs with daily analytics.
- **Blueprint Management:** Professional Workout and Diet plan assignments.
- **Enterprise UI:** Responsive, modern design using **React Bootstrap** and **Lucide Icons**.

## 🛠 Tech Stack
- **Frontend:** React.js, Vite, Axios, Bootstrap, Lucide Icons.
- **Backend:** Node.js, Express.js.
- **Database:** MySQL with **Sequelize ORM** (Model-View-Controller architecture).
- **Security:** Bcrypt.js, JSON Web Tokens (JWT).

## 📁 Project Structure (MVC + Service Layer)
- `backend/controllers`: Request handlers and traffic management.
- `backend/services`: Core business logic (Engine Room).
- `backend/models`: Sequelize definitions and DB mappings.
- `frontend-react/src/pages`: Professional UI modules.

## 🏁 Quick Start
1. **Database:** Import `database/schema.sql` into MySQL.
2. **Backend:**
   ```bash
   cd backend
   npm install
   npm run dev
   ```
3. **Frontend:**
   ```bash
   cd frontend-react
   npm install
   npm run dev
   ```

## 🔐 Security Standards
- Password hashing at the model level (Automatic).
- Protected API routes via JWT.
- Error genericization to prevent user enumeration.
