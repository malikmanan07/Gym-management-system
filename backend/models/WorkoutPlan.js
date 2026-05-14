const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');

const WorkoutPlan = sequelize.define('WorkoutPlan', {
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
    difficulty: {
        type: DataTypes.ENUM('beginner', 'intermediate', 'advanced'),
        defaultValue: 'beginner'
    },
    exercises: {
        type: DataTypes.JSON, // Array of exercises
        defaultValue: []
    },
    createdBy: {
        type: DataTypes.INTEGER,
        field: 'created_by'
    }
}, {
    tableName: 'workout_plans',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

module.exports = WorkoutPlan;
