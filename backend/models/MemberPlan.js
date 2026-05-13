const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');

const MemberPlan = sequelize.define('MemberPlan', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    member_id: { type: DataTypes.INTEGER, allowNull: false, unique: true },
    workout_plan_id: { type: DataTypes.INTEGER },
    diet_plan_id: { type: DataTypes.INTEGER }
}, {
    tableName: 'member_plans',
    timestamps: true,
    paranoid: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at'
});

module.exports = MemberPlan;
