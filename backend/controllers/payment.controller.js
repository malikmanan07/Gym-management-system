const paymentService = require('../services/payment.service');
const logger = require('../utils/logger');

exports.createPayment = async (req, res, next) => {
    try {
        const payment = await paymentService.createPayment(req.body);
        res.status(201).json({ success: true, message: 'Payment recorded', id: payment.id });
    } catch (err) {
        logger.error('CreatePayment Error:', err.message);
        next(err);
    }
};

exports.getPayments = async (req, res, next) => {
    try {
        const result = await paymentService.getRecentPayments(req.query);
        res.status(200).json({ success: true, ...result });
    } catch (err) {
        next(err);
    }
};
exports.deletePayment = async (req, res, next) => {
    try {
        await paymentService.deletePayment(req.params.id);
        res.status(200).json({ success: true, message: 'Payment record deleted' });
    } catch (err) {
        next(err);
    }
};
