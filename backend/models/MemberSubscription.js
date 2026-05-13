const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');

const MemberSubscription = sequelize.define('MemberSubscription', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    member_id: { type: DataTypes.INTEGER, allowNull: false },
    plan_id: { type: DataTypes.INTEGER, allowNull: false },
    start_date: { type: DataTypes.DATEONLY, allowNull: false },
    end_date: { type: DataTypes.DATEONLY, allowNull: false },
    status: { type: DataTypes.ENUM('active', 'expired', 'cancelled'), defaultValue: 'active' }
}, {
    tableName: 'member_subscriptions',
    timestamps: true,
    paranoid: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at'
});

module.exports = MemberSubscription;
