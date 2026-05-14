const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');

const MemberPlan = sequelize.define('MemberPlan', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    memberId: { 
        type: DataTypes.INTEGER, 
        allowNull: false, 
        unique: true,
        field: 'member_id'
    },
    workoutPlanId: { 
        type: DataTypes.INTEGER,
        field: 'workout_plan_id'
    },
    dietPlanId: { 
        type: DataTypes.INTEGER,
        field: 'diet_plan_id'
    }
}, {
    tableName: 'member_plans',
    timestamps: true,
    paranoid: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at'
});

module.exports = MemberPlan;
