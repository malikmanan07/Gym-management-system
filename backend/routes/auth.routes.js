const express = require('express');
const router = express.Router();
const { login, getMe } = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth.middleware');
const validate = require('../middleware/zod.middleware');
const { loginSchema } = require('../validations/schemas');

router.post('/login', validate(loginSchema), login);
router.get('/me', protect, getMe);

module.exports = router;
