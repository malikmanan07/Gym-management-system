const memberService = require('../services/member.service');
const logger = require('../utils/logger');

exports.getAllMembers = async (req, res, next) => {
    try {
        const result = await memberService.getAllMembers(req.query);
        res.status(200).json({ success: true, ...result });
    } catch (err) {
        logger.error('GetAllMembers Error:', err.message);
        next(err);
    }
};

exports.getMember = async (req, res, next) => {
    try {
        const member = await memberService.getMemberById(req.params.id);
        res.status(200).json({ success: true, data: member });
    } catch (err) {
        logger.error('GetMember Error:', err.message);
        next(err);
    }
};

exports.createMember = async (req, res, next) => {
    try {
        const member = await memberService.createMember(req.body);
        res.status(201).json({ success: true, message: 'Member created successfully', id: member.id });
    } catch (err) {
        logger.error('CreateMember Error:', err.message);
        next(err);
    }
};

exports.updateMember = async (req, res, next) => {
    try {
        await memberService.updateMember(req.params.id, req.body);
        res.status(200).json({ success: true, message: 'Member updated successfully' });
    } catch (err) {
        logger.error('UpdateMember Error:', err.message);
        next(err);
    }
};

exports.assignPlans = async (req, res, next) => {
    try {
        await memberService.assignPlans(req.params.id, req.body);
        res.status(200).json({ success: true, message: 'Plans assigned successfully' });
    } catch (err) {
        logger.error('AssignPlans Error:', err.message);
        next(err);
    }
};

exports.deleteMember = async (req, res, next) => {
    try {
        await memberService.deleteMember(req.params.id);
        res.status(200).json({ success: true, message: 'Member deleted successfully' });
    } catch (err) {
        logger.error('DeleteMember Error:', err.message);
        next(err);
    }
};
