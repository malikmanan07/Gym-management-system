const attendanceService = require('../services/attendance.service');
const logger = require('../utils/logger');

exports.markAttendance = async (req, res, next) => {
    try {
        const log = await attendanceService.markAttendance(req.body.memberId);
        res.status(200).json({ success: true, message: 'Attendance updated', data: log });
    } catch (err) {
        logger.error('MarkAttendance Error:', err.message);
        next(err);
    }
};

exports.getLogs = async (req, res, next) => {
    try {
        const result = await attendanceService.getAttendanceLogs(req.query);
        res.status(200).json({ success: true, ...result });
    } catch (err) {
        next(err);
    }
};
exports.deleteLog = async (req, res, next) => {
    try {
        await attendanceService.deleteLog(req.params.id);
        res.status(200).json({ success: true, message: 'Log deleted' });
    } catch (err) {
        next(err);
    }
};
