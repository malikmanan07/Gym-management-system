const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');

const Attendance = sequelize.define('Attendance', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    memberId: { 
        type: DataTypes.INTEGER, 
        allowNull: false,
        field: 'member_id'
    },
    date: { type: DataTypes.DATEONLY, allowNull: false },
    checkIn: { 
        type: DataTypes.TIME, 
        allowNull: false,
        field: 'check_in'
    },
    checkOut: { 
        type: DataTypes.TIME,
        field: 'check_out'
    }
}, {
    tableName: 'attendance',
    timestamps: true,
    paranoid: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at'
});

module.exports = Attendance;
