const dashboardService = require('../services/dashboard.service');
const cache = require('../utils/cache');
const logger = require('../utils/logger');

exports.getStats = async (req, res, next) => {
    try {
        const cacheKey = 'dashboard_stats';
        const cachedData = cache.get(cacheKey);

        if (cachedData) {
            return res.status(200).json({
                success: true,
                ...cachedData,
                source: 'cache'
            });
        }

        const stats = await dashboardService.getDashboardStats();
        
        // Cache the data for 5 minutes
        cache.set(cacheKey, stats, 300);

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
