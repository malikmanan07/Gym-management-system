const { Attendance, Member } = require('../models');
const { Op } = require('sequelize');
const AttendanceDTO = require('../dtos/attendance.dto');
const logger = require('../utils/logger');

class AttendanceService {
    // Helper to get MySQL compatible time (HH:mm:ss)
    _getCurrentTime() {
        const now = new Date();
        return now.toTimeString().split(' ')[0]; // Returns HH:mm:ss
    }

    async markAttendance(memberId) {
        try {
            const member = await Member.findByPk(memberId);
            if (!member) throw new Error('Member ID not found');

            const today = new Date().toISOString().split('T')[0];
            const currentTime = this._getCurrentTime();
            
            // Check if already checked in today
            const existing = await Attendance.findOne({
                where: { memberId, date: today }
            });

            if (existing) {
                if (existing.checkOut) throw new Error('Already completed session for today');
                // Auto check-out
                return await existing.update({ checkOut: currentTime });
            }

            // Create check-in
            return await Attendance.create({
                memberId,
                date: today,
                checkIn: currentTime
            });
        } catch (err) {
            logger.error('AttendanceService.markAttendance Error:', err);
            throw err;
        }
    }

    async getAttendanceLogs(query = {}) {
        try {
            const { date = new Date().toISOString().split('T')[0], search = '' } = query;

            const include = {
                model: Member,
                attributes: ['firstName', 'lastName'],
                required: false
            };

            if (search) {
                include.where = {
                    [Op.or]: [
                        { firstName: { [Op.like]: `%${search}%` } },
                        { lastName: { [Op.like]: `%${search}%` } }
                    ]
                };
                include.required = true;
            }

            const logs = await Attendance.findAll({
                where: { date },
                include: [include],
                order: [['checkIn', 'DESC']]
            });

            return {
                logs: (logs || []).map(log => AttendanceDTO.toSummary(log))
            };
        } catch (err) {
            logger.error('AttendanceService.getAttendanceLogs Error:', err);
            return { logs: [] };
        }
    }

    async deleteLog(id) {
        try {
            const log = await Attendance.findByPk(id);
            if (!log) throw new Error('Log entry not found');
            return await log.destroy();
        } catch (err) {
            logger.error('AttendanceService.deleteLog Error:', err);
            throw err;
        }
    }
}

module.exports = new AttendanceService();
