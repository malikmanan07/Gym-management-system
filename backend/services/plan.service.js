const { WorkoutPlan, DietPlan } = require('../models');

class PlanService {
    async getAllWorkoutPlans() {
        return await WorkoutPlan.findAll({
            attributes: ['id', 'name', 'description', 'difficulty', 'exercises']
        });
    }

    async getAllDietPlans() {
        return await DietPlan.findAll({
            attributes: ['id', 'name', 'description', 'goal', 'meals']
        });
    }

    async createWorkoutPlan(data) {
        return await WorkoutPlan.create(data);
    }

    async createDietPlan(data) {
        return await DietPlan.create(data);
    }

    async updateWorkoutPlan(id, data) {
        const plan = await WorkoutPlan.findByPk(id);
        if (!plan) throw new Error('Workout plan not found');
        return await plan.update(data);
    }

    async updateDietPlan(id, data) {
        const plan = await DietPlan.findByPk(id);
        if (!plan) throw new Error('Diet plan not found');
        return await plan.update(data);
    }

    async deleteWorkoutPlan(id) {
        const plan = await WorkoutPlan.findByPk(id);
        if (!plan) throw new Error('Workout plan not found');
        return await plan.destroy();
    }

    async deleteDietPlan(id) {
        const plan = await DietPlan.findByPk(id);
        if (!plan) throw new Error('Diet plan not found');
        return await plan.destroy();
    }
}

module.exports = new PlanService();
