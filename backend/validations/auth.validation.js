const { body } = require('express-validator');

exports.loginValidation = [
    body('username')
        .notEmpty().withMessage('Username is required')
        .isString().withMessage('Username must be a string')
        .trim().escape(),
    body('password')
        .notEmpty().withMessage('Password is required')
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
];
