const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');

const MemberSubscription = sequelize.define('MemberSubscription', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    memberId: { 
        type: DataTypes.INTEGER, 
        allowNull: false,
        field: 'member_id'
    },
    planId: { 
        type: DataTypes.INTEGER, 
        allowNull: false,
        field: 'plan_id'
    },
    startDate: { 
        type: DataTypes.DATEONLY, 
        allowNull: false,
        field: 'start_date'
    },
    endDate: { 
        type: DataTypes.DATEONLY, 
        allowNull: false,
        field: 'end_date'
    },
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
