const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');

const Member = sequelize.define('Member', {
    id: { 
        type: DataTypes.INTEGER, 
        primaryKey: true, 
        autoIncrement: true 
    },
    firstName: { 
        type: DataTypes.STRING, 
        allowNull: false,
        field: 'first_name'
    },
    lastName: { 
        type: DataTypes.STRING, 
        allowNull: false,
        field: 'last_name'
    },
    email: { 
        type: DataTypes.STRING, 
        allowNull: true,
        unique: true 
    },
    phone: { 
        type: DataTypes.STRING, 
        allowNull: false,
        unique: true 
    },
    gender: { 
        type: DataTypes.ENUM('male', 'female', 'other'),
        defaultValue: 'male'
    },
    status: { 
        type: DataTypes.ENUM('active', 'inactive', 'expired'),
        defaultValue: 'active'
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
    tableName: 'members',
    timestamps: true,
    paranoid: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at'
});

module.exports = Member;
