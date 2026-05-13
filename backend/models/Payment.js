const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');

const Payment = sequelize.define('Payment', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    memberId: { 
        type: DataTypes.INTEGER, 
        allowNull: false,
        field: 'member_id'
    },
    amount: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    paymentDate: { 
        type: DataTypes.DATE, 
        defaultValue: DataTypes.NOW,
        field: 'payment_date'
    },
    paymentMethod: { 
        type: DataTypes.STRING, // Changed from ENUM to STRING for flexibility
        allowNull: false,
        field: 'payment_method'
    },
    paymentStatus: { 
        type: DataTypes.ENUM('completed', 'pending', 'failed'), 
        defaultValue: 'completed',
        field: 'payment_status'
    }
}, {
    tableName: 'payments',
    timestamps: true,
    paranoid: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at'
});

module.exports = Payment;
