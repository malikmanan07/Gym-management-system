# FlexGym Management System (Pro)

A production-ready, highly secure, and responsive gym management application built with a modern service-oriented architecture.

## 🚀 Quick Start Guide

### 1. Prerequisites
- **Node.js** (v18+)
- **MySQL** (Running on port 3306)
- **NPM** or **Yarn**

### 2. Backend Setup
1. Navigate to the `backend` directory.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure Environment:
   Create a `.env` file in the `backend` folder:
   ```env
   NODE_ENV=development
   PORT=5000
   DB_HOST=localhost
   DB_USER=root
   DB_PASS=your_password
   DB_NAME=gym_management
   JWT_SECRET=your_super_secret_key
   CORS_ORIGIN=http://localhost:5173
   ```
4. Start Server:
   ```bash
   npm run dev
   ```

### 3. Frontend Setup
1. Navigate to the `frontend-react` directory.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start Application:
   ```bash
   npm run dev
   ```

---

## 🛠 Features implemented
- **Service-Oriented Architecture (SOA)**: Decoupled business logic for maximum scalability.
- **Data Protection (DTOs)**: Zero exposure of sensitive DB fields (passwords, internal IDs).
- **Professional Theme**: "Active White & Crimson" high-contrast design.
- **Full Responsiveness**: Optimized for Mobile, Tablet, and Desktop viewports.
- **Soft Delete (Paranoid Mode)**: Secure data removal with auditability.
- **Pagination & Search**: High-performance data tables with backend-level filtering.
- **Security Hardening**: JWT Auth, RBAC, Rate Limiting, and Zod validation.

---

## 📂 Project Structure
- `/backend`: Node.js/Express server with Sequelize ORM.
- `/frontend-react`: Vite/React.js application with React Bootstrap.
- `.gitignore`: Configured for enterprise standards.

---

## 👤 Admin Credentials (Initial)
- **Username**: admin
- **Password**: admin123 (or as configured in your DB seed)

*Designed & Finalized for Enterprise Use.*
