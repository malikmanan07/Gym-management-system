const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');

const TrainerAssignment = sequelize.define('TrainerAssignment', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    trainer_id: { type: DataTypes.INTEGER, allowNull: false },
    member_id: { type: DataTypes.INTEGER, allowNull: false }
}, {
    tableName: 'trainer_assignments',
    uniqueKeys: {
        trainer_member_unique: {
            fields: ['trainer_id', 'member_id']
        }
    }
});

module.exports = TrainerAssignment;
