const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');

const MembershipPlan = sequelize.define('MembershipPlan', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT },
    price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    duration_months: { type: DataTypes.INTEGER, allowNull: false },
    status: { type: DataTypes.ENUM('active', 'inactive'), defaultValue: 'active' }
}, {
    tableName: 'membership_plans',
    timestamps: true,
    paranoid: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at'
});

module.exports = MembershipPlan;
