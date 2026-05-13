const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');

const Trainer = sequelize.define('Trainer', {
    id: { 
        type: DataTypes.INTEGER, 
        primaryKey: true, 
        autoIncrement: true 
    },
    fullName: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'full_name'
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    phone: {
        type: DataTypes.STRING
    },
    specialization: { 
        type: DataTypes.STRING 
    },
    experienceYears: { 
        type: DataTypes.INTEGER,
        field: 'experience_years'
    },
    bio: { 
        type: DataTypes.TEXT 
    }
}, {
    tableName: 'trainers',
    timestamps: true,
    paranoid: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at'
});

module.exports = Trainer;
