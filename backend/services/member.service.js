const { Member, WorkoutPlan, DietPlan } = require('../models');
const { Op } = require('sequelize');
const MemberDTO = require('../dtos/member.dto');
const logger = require('../utils/logger');

class MemberService {
    async getAllMembers(query = {}) {
        try {
            const { search = '', status = '', page = 1, limit = 10 } = query;
            const offset = (page - 1) * limit;

            const where = {};
            if (search) {
                where[Op.or] = [
                    { firstName: { [Op.like]: `%${search}%` } },
                    { lastName: { [Op.like]: `%${search}%` } },
                    { email: { [Op.like]: `%${search}%` } },
                    { phone: { [Op.like]: `%${search}%` } }
                ];
            }
            if (status) where.status = status;

            const { count, rows } = await Member.findAndCountAll({
                where,
                include: [
                    { model: WorkoutPlan, as: 'workoutPlan', attributes: ['name'], required: false },
                    { model: DietPlan, as: 'dietPlan', attributes: ['name'], required: false }
                ],
                limit: parseInt(limit),
                offset: parseInt(offset),
                order: [['created_at', 'DESC']]
            });

            return {
                total: count || 0,
                page: parseInt(page),
                members: (rows || []).map(row => ({
                    ...MemberDTO.toSummary(row),
                    workoutPlan: row.workoutPlan?.name || 'Not Assigned',
                    dietPlan: row.dietPlan?.name || 'Not Assigned'
                }))
            };
        } catch (err) {
            logger.error('MemberService.getAllMembers Error:', err);
            return { total: 0, page: 1, members: [] };
        }
    }

    async getMemberById(id) {
        try {
            const member = await Member.findByPk(id, {
                include: [
                    { model: WorkoutPlan, as: 'workoutPlan' },
                    { model: DietPlan, as: 'dietPlan' }
                ]
            });
            if (!member) throw new Error('Member not found');
            return MemberDTO.toDetail(member);
        } catch (err) {
            logger.error('MemberService.getMemberById Error:', err);
            throw err;
        }
    }

    async createMember(data) {
        try {
            return await Member.create(data);
        } catch (err) {
            logger.error('MemberService.createMember Error:', err);
            throw err;
        }
    }

    async updateMember(id, data) {
        try {
            const member = await Member.findByPk(id);
            if (!member) throw new Error('Member not found');
            return await member.update(data);
        } catch (err) {
            logger.error('MemberService.updateMember Error:', err);
            throw err;
        }
    }

    async assignPlans(id, data) {
        try {
            const member = await Member.findByPk(id);
            if (!member) throw new Error('Member not found');
            
            return await member.update({
                workoutPlanId: data.workoutPlanId || null,
                dietPlanId: data.dietPlanId || null
            });
        } catch (err) {
            logger.error('MemberService.assignPlans Error:', err);
            throw err;
        }
    }

    async deleteMember(id) {
        try {
            const member = await Member.findByPk(id);
            if (!member) throw new Error('Member not found');
            
            // Professional Deactivation instead of deletion
            return await member.update({ status: 'inactive' });
        } catch (err) {
            logger.error('MemberService.deleteMember Error:', err);
            throw err;
        }
    }
}

module.exports = new MemberService();
