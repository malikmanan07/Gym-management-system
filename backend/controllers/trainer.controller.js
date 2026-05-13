const trainerService = require('../services/trainer.service');
const planService = require('../services/plan.service');
const logger = require('../utils/logger');

exports.getAllTrainers = async (req, res, next) => {
    try {
        const trainers = await trainerService.getAllTrainers();
        res.status(200).json({ success: true, data: trainers });
    } catch (err) {
        next(err);
    }
};

exports.createTrainer = async (req, res, next) => {
    try {
        const trainer = await trainerService.createTrainer(req.body);
        res.status(201).json({ success: true, message: 'Trainer onboarded successfully', data: trainer });
    } catch (err) {
        logger.error('CreateTrainer Error:', err.message);
        next(err);
    }
};

exports.updateTrainer = async (req, res, next) => {
    try {
        const trainer = await trainerService.updateTrainer(req.params.id, req.body);
        res.status(200).json({ success: true, message: 'Trainer updated successfully', data: trainer });
    } catch (err) {
        next(err);
    }
};

exports.deleteTrainer = async (req, res, next) => {
    try {
        await trainerService.deleteTrainer(req.params.id);
        res.status(200).json({ success: true, message: 'Trainer deleted successfully' });
    } catch (err) {
        next(err);
    }
};

exports.getTrainerMembers = async (req, res, next) => {
    try {
        const members = await trainerService.getTrainerMembers(req.params.id);
        res.status(200).json({ success: true, data: members });
    } catch (err) {
        next(err);
    }
};

exports.assignPlan = async (req, res, next) => {
    try {
        await trainerService.assignPlan(req.body);
        res.status(200).json({ success: true, message: 'Plan assigned successfully' });
    } catch (err) {
        logger.error('AssignPlan Error:', err.message);
        next(err);
    }
};

exports.getWorkoutPlans = async (req, res, next) => {
    try {
        const plans = await planService.getAllWorkoutPlans();
        res.status(200).json({ success: true, data: plans });
    } catch (err) {
        next(err);
    }
};

exports.getDietPlans = async (req, res, next) => {
    try {
        const plans = await planService.getAllDietPlans();
        res.status(200).json({ success: true, data: plans });
    } catch (err) {
        next(err);
    }
};

exports.createWorkoutPlan = async (req, res, next) => {
    try {
        const plan = await planService.createWorkoutPlan(req.body);
        res.status(201).json({ success: true, message: 'Workout plan created', data: plan });
    } catch (err) {
        next(err);
    }
};

exports.createDietPlan = async (req, res, next) => {
    try {
        const plan = await planService.createDietPlan(req.body);
        res.status(201).json({ success: true, message: 'Diet plan created', data: plan });
    } catch (err) {
        next(err);
    }
};

exports.updateWorkoutPlan = async (req, res, next) => {
    try {
        const plan = await planService.updateWorkoutPlan(req.params.id, req.body);
        res.status(200).json({ success: true, message: 'Workout plan updated', data: plan });
    } catch (err) {
        next(err);
    }
};

exports.updateDietPlan = async (req, res, next) => {
    try {
        const plan = await planService.updateDietPlan(req.params.id, req.body);
        res.status(200).json({ success: true, message: 'Diet plan updated', data: plan });
    } catch (err) {
        next(err);
    }
};

exports.deleteWorkoutPlan = async (req, res, next) => {
    try {
        await planService.deleteWorkoutPlan(req.params.id);
        res.status(200).json({ success: true, message: 'Workout plan deleted' });
    } catch (err) {
        next(err);
    }
};

exports.deleteDietPlan = async (req, res, next) => {
    try {
        await planService.deleteDietPlan(req.params.id);
        res.status(200).json({ success: true, message: 'Diet plan deleted' });
    } catch (err) {
        next(err);
    }
};
