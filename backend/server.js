const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const path = require('path');
require('dotenv').config();
const { sequelize } = require('./models');
const logger = require('./utils/logger');

const app = express();

// Security Middleware
app.use(helmet({
    crossOriginResourcePolicy: false,
}));

// Professional CORS configuration
const corsOptions = {
    origin: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
};
app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('combined', { stream: { write: message => logger.info(message.trim()) } }));

// Strict Rate Limiting for API
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: { success: false, message: 'Too many requests, please try again later.' },
    standardHeaders: true,
    legacyHeaders: false,
});
app.use('/api/', apiLimiter);

// Auth Rate Limiter (Brute force protection)
const authLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 10, // 10 attempts
    message: { success: false, message: 'Too many login attempts. Please try again after an hour.' }
});
app.use('/api/auth/login', authLimiter);

// Static Folders
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
const authRoutes = require('./routes/auth.routes');
const memberRoutes = require('./routes/member.routes');
const attendanceRoutes = require('./routes/attendance.routes');
const paymentRoutes = require('./routes/payment.routes');
const trainerRoutes = require('./routes/trainer.routes');
const dashboardRoutes = require('./routes/dashboard.routes');

app.use('/api/auth', authRoutes);
app.use('/api/members', memberRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/trainers', trainerRoutes);
app.use('/api/dashboard', dashboardRoutes);

// 404 Handler
app.use((req, res) => {
    res.status(404).json({ success: false, message: 'Resource not found' });
});

// Professional Error Handling Middleware
app.use((err, req, res, next) => {
    logger.error(`${err.status || 500} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
    
    res.status(err.status || 500).json({
        success: false,
        message: process.env.NODE_ENV === 'production' ? 'Internal Server Error' : err.message,
        errors: err.errors || null
    });
});

const PORT = process.env.PORT || 5000;

// Sync Database and Start Server
sequelize.sync({ alter: false }).then(() => {
    logger.info('Database connected and verified');
    app.listen(PORT, () => {
        logger.info(`Server running on port ${PORT} [${process.env.NODE_ENV}]`);
    });
}).catch(err => {
    logger.error('Database Connection Error:', err);
    process.exit(1);
});
