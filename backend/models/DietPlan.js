const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');

const DietPlan = sequelize.define('DietPlan', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT
    },
    goal: {
        type: DataTypes.ENUM('weight_loss', 'muscle_gain', 'maintenance'),
        defaultValue: 'maintenance'
    },
    meals: {
        type: DataTypes.JSON, // Daily meal structure
        defaultValue: []
    },
    createdBy: {
        type: DataTypes.INTEGER,
        field: 'created_by'
    }
}, {
    tableName: 'diet_plans',
    timestamps: true,
    paranoid: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at'
});

module.exports = DietPlan;
