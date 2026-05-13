const dashboardService = require('../services/dashboard.service');
const cache = require('../utils/cache');
const logger = require('../utils/logger');

exports.getStats = async (req, res, next) => {
    try {
        const stats = await dashboardService.getDashboardStats();
        
        res.status(200).json({
            success: true,
            ...stats,
            source: 'database'
        });
    } catch (err) {
        logger.error('DashboardController Error:', err.message);
        next(err);
    }
};
