const { Payment, Member } = require('../models');
const { Op } = require('sequelize');
const PaymentDTO = require('../dtos/payment.dto');
const logger = require('../utils/logger');

class PaymentService {
    async createPayment(data) {
        try {
            return await Payment.create({
                memberId: data.memberId,
                amount: data.amount,
                paymentMethod: data.paymentMethod || 'cash',
                paymentDate: new Date(),
                paymentStatus: 'completed'
            });
        } catch (err) {
            logger.error('PaymentService.createPayment Error:', err);
            throw err;
        }
    }

    async getRecentPayments(query = {}) {
        try {
            const { page = 1, limit = 10, search = '' } = query;
            const offset = (page - 1) * limit;

            const memberWhere = {};
            if (search) {
                memberWhere[Op.or] = [
                    { firstName: { [Op.like]: `%${search}%` } },
                    { lastName: { [Op.like]: `%${search}%` } }
                ];
            }

            const { count, rows } = await Payment.findAndCountAll({
                include: [{ 
                    model: Member, 
                    attributes: ['firstName', 'lastName'],
                    where: search ? memberWhere : undefined,
                    required: search ? true : false
                }],
                order: [['paymentDate', 'DESC']],
                limit: parseInt(limit),
                offset: parseInt(offset)
            });

            return {
                total: count || 0,
                page: parseInt(page),
                data: (rows || []).map(row => PaymentDTO.toSummary(row))
            };
        } catch (err) {
            logger.error('PaymentService.getRecentPayments Error:', err);
            return { total: 0, page: 1, data: [] };
        }
    }

    async deletePayment(id) {
        try {
            const payment = await Payment.findByPk(id);
            if (!payment) throw new Error('Payment record not found');
            return await payment.destroy();
        } catch (err) {
            logger.error('PaymentService.deletePayment Error:', err);
            throw err;
        }
    }
}

module.exports = new PaymentService();
