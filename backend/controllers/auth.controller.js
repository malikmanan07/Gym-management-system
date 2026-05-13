const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { User } = require('../models');
const UserDTO = require('../dtos/user.dto');
const logger = require('../utils/logger');

exports.login = async (req, res, next) => {
    try {
        const { username, password } = req.body;

        const user = await User.findOne({ where: { username } });
        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { id: user.id, role: user.role, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRE }
        );

        res.status(200).json({
            success: true,
            token,
            user: UserDTO.toResponse(user)
        });

    } catch (err) {
        logger.error('Login Error:', err.message);
        next(err);
    }
};

exports.getMe = async (req, res, next) => {
    try {
        const user = await User.findByPk(req.user.id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        res.status(200).json({
            success: true,
            user: UserDTO.toResponse(user)
        });
    } catch (err) {
        next(err);
    }
};
