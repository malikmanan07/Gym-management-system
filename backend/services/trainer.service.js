const { Trainer, Member } = require('../models');
const { Op } = require('sequelize');
const TrainerDTO = require('../dtos/trainer.dto');

class TrainerService {
    async getAllTrainers() {
        const trainers = await Trainer.findAll({
            order: [['created_at', 'DESC']]
        });
        return TrainerDTO.toList(trainers);
    }

    async getTrainerMembers(trainerId) {
        return await Member.findAll({
            where: { trainer_id: trainerId }
        });
    }

    async createTrainer(data) {
        const trainer = await Trainer.create({
            fullName: data.full_name,
            email: data.email,
            phone: data.phone,
            specialization: data.specialization,
            experienceYears: data.experience_years,
            bio: data.bio
        });
        return TrainerDTO.toSummary(trainer);
    }

    async updateTrainer(id, data) {
        const trainer = await Trainer.findByPk(id);
        if (!trainer) throw new Error('Trainer not found');

        const updated = await trainer.update({
            fullName: data.full_name,
            email: data.email,
            phone: data.phone,
            specialization: data.specialization,
            experienceYears: data.experience_years,
            bio: data.bio
        });
        return TrainerDTO.toSummary(updated);
    }

    async deleteTrainer(id) {
        const trainer = await Trainer.findByPk(id);
        if (!trainer) throw new Error('Trainer not found');
        return await trainer.destroy();
    }

    async assignPlan({ memberId, planId, type }) {
        const member = await Member.findByPk(memberId);
        if (!member) throw new Error('Member not found');
        
        if (type === 'workout') {
            return await member.update({ workout_plan_id: planId });
        } else {
            return await member.update({ diet_plan_id: planId });
        }
    }
}

module.exports = new TrainerService();
