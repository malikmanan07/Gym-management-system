const { body } = require('express-validator');

exports.createMemberValidation = [
    body('first_name').notEmpty().withMessage('First name is required').trim().escape(),
    body('last_name').notEmpty().withMessage('Last name is required').trim().escape(),
    body('email').optional({ checkFalsy: true }).isEmail().withMessage('Invalid email format').normalizeEmail(),
    body('phone').notEmpty().withMessage('Phone number is required').isLength({ min: 10 }).withMessage('Phone must be at least 10 digits'),
    body('gender').optional().isIn(['male', 'female', 'other']).withMessage('Invalid gender'),
    body('dob').optional().isDate().withMessage('Invalid date of birth'),
    body('status').optional().isIn(['active', 'inactive', 'expired']).withMessage('Invalid status')
];
