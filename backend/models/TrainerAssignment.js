const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');

const TrainerAssignment = sequelize.define('TrainerAssignment', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    trainerId: { 
        type: DataTypes.INTEGER, 
        allowNull: false,
        field: 'trainer_id'
    },
    memberId: { 
        type: DataTypes.INTEGER, 
        allowNull: false,
        field: 'member_id'
    }
}, {
    tableName: 'trainer_assignments',
    uniqueKeys: {
        trainer_member_unique: {
            fields: ['trainer_id', 'member_id']
        }
    }
});

module.exports = TrainerAssignment;
