const express = require('express');
const router = express.Router();
const { createPayment, getPayments, deletePayment } = require('../controllers/payment.controller');
const { protect, authorize } = require('../middleware/auth.middleware');
const validate = require('../middleware/zod.middleware');
const { paymentSchema } = require('../validations/schemas');

router.use(protect);

router.post('/', authorize('admin', 'staff'), validate(paymentSchema), createPayment);
router.get('/', getPayments);
router.delete('/:id', authorize('admin'), deletePayment);

module.exports = router;
