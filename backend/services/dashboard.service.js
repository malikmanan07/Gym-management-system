const { Member, Payment, Attendance, MembershipPlan, MemberSubscription, sequelize, WorkoutPlan, DietPlan } = require('../models');
const { Op } = require('sequelize');
const logger = require('../utils/logger');

class DashboardService {
    async getDashboardStats() {
        try {
            // Current Stats
            const totalMembers = await Member.count({ where: { status: 'active' } }).catch(() => 0);
            const activeMembers = await Member.count({ where: { status: 'active' } }).catch(() => 0);

            const currentMonthRevenue = await Payment.sum('amount', {
                where: {
                    paymentDate: {
                        [Op.and]: [
                            sequelize.literal('MONTH(payment_date) = MONTH(CURRENT_DATE())'),
                            sequelize.literal('YEAR(payment_date) = YEAR(CURRENT_DATE())')
                        ]
                    }
                }
            }).catch(() => 0) || 0;

            const attendanceToday = await Attendance.count({
                include: [{ model: Member, where: { status: 'active' }, required: true }],
                where: { date: { [Op.eq]: sequelize.literal('CURDATE()') } }
            }).catch(() => 0);

            // Growth Calculations (Previous Period Data)
            const prevMonthMembers = await Member.count({
                where: {
                    status: 'active',
                    createdAt: { [Op.lt]: sequelize.literal('DATE_SUB(CURRENT_DATE(), INTERVAL 1 MONTH)') }
                }
            }).catch(() => 0);

            const prevMonthRevenue = await Payment.sum('amount', {
                where: {
                    paymentDate: {
                        [Op.and]: [
                            sequelize.literal('MONTH(payment_date) = MONTH(DATE_SUB(CURRENT_DATE(), INTERVAL 1 MONTH))'),
                            sequelize.literal('YEAR(payment_date) = YEAR(DATE_SUB(CURRENT_DATE(), INTERVAL 1 MONTH))')
                        ]
                    }
                }
            }).catch(() => 0) || 0;

            const attendanceYesterday = await Attendance.count({
                include: [{ model: Member, where: { status: 'active' }, required: true }],
                where: { date: { [Op.eq]: sequelize.literal('DATE_SUB(CURDATE(), INTERVAL 1 DAY)') } }
            }).catch(() => 0);

            // Helper to calculate percentage growth
            const calcGrowth = (current, previous) => {
                if (!previous || previous === 0) return current > 0 ? 100 : 0;
                return Math.round(((current - previous) / previous) * 100);
            };

            const revenueData = await Payment.findAll({
                attributes: [
                    [sequelize.fn('MONTHNAME', sequelize.col('payment_date')), 'month'],
                    [sequelize.fn('SUM', sequelize.col('amount')), 'total']
                ],
                where: {
                    paymentDate: {
                        [Op.gte]: sequelize.literal('DATE_SUB(CURDATE(), INTERVAL 6 MONTH)')
                    }
                },
                group: [
                    sequelize.fn('YEAR', sequelize.col('payment_date')),
                    sequelize.fn('MONTH', sequelize.col('payment_date')),
                    sequelize.fn('MONTHNAME', sequelize.col('payment_date'))
                ],
                order: [
                    [sequelize.fn('YEAR', sequelize.col('payment_date')), 'ASC'],
                    [sequelize.fn('MONTH', sequelize.col('payment_date')), 'ASC']
                ],
                raw: true
            }).catch(() => []);

            const membershipDist = await MembershipPlan.findAll({
                attributes: [
                    'name',
                    [sequelize.fn('COUNT', sequelize.col('MemberSubscriptions.id')), 'count']
                ],
                include: [{
                    model: MemberSubscription,
                    attributes: [],
                    where: { status: 'active' },
                    include: [{ model: Member, where: { status: 'active' }, required: true }],
                    required: false
                }],
                group: ['MembershipPlan.id', 'MembershipPlan.name'],
                raw: true
            }).catch(() => []);

            const recentPayments = await Payment.findAll({
                include: [{ model: Member, attributes: ['firstName', 'lastName'], required: false }],
                order: [['paymentDate', 'DESC']],
                limit: 5,
                attributes: ['id', 'amount', 'paymentDate']
            }).catch(() => []);

            return {
                stats: {
                    totalMembers: { value: totalMembers, growth: calcGrowth(totalMembers, prevMonthMembers) },
                    activeMembers: { value: activeMembers, growth: 0 },
                    monthlyRevenue: { value: currentMonthRevenue, growth: calcGrowth(currentMonthRevenue, prevMonthRevenue) },
                    attendanceToday: { value: attendanceToday, growth: calcGrowth(attendanceToday, attendanceYesterday) }
                },
                charts: {
                    revenue: revenueData || [],
                    membershipDistribution: membershipDist || []
                },
                recentPayments: (recentPayments || []).map(p => ({
                    id: p?.id,
                    memberName: p?.Member ? `${p.Member.firstName} ${p.Member.lastName}` : 'System Record',
                    amount: p?.amount || 0,
                    date: p?.paymentDate
                }))
            };
        } catch (err) {
            logger.error('DashboardService Error:', err);
            return {
                stats: { totalMembers: { value: 0, growth: 0 }, activeMembers: { value: 0, growth: 0 }, monthlyRevenue: { value: 0, growth: 0 }, attendanceToday: { value: 0, growth: 0 } },
                charts: { revenue: [], membershipDistribution: [] },
                recentPayments: []
            };
        }
    }
}

module.exports = new DashboardService();
