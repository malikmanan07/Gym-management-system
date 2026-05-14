const sequelize = require('../config/db.config');
const User = require('./User');
const Member = require('./Member');
const MembershipPlan = require('./MembershipPlan');
const MemberSubscription = require('./MemberSubscription');
const Attendance = require('./Attendance');
const Payment = require('./Payment');
const Trainer = require('./Trainer');
const MemberPlan = require('./MemberPlan');
const TrainerAssignment = require('./TrainerAssignment');
const WorkoutPlan = require('./WorkoutPlan');
const DietPlan = require('./DietPlan');

// Associations

// Member & Subscriptions
Member.hasMany(MemberSubscription, { foreignKey: 'member_id', onDelete: 'CASCADE' });
MemberSubscription.belongsTo(Member, { foreignKey: 'member_id' });

MembershipPlan.hasMany(MemberSubscription, { foreignKey: 'plan_id', onDelete: 'CASCADE' });
MemberSubscription.belongsTo(MembershipPlan, { foreignKey: 'plan_id' });

// Member & Attendance/Payments (Using CASCADE because member_id is NOT NULL in these tables)
Member.hasMany(Attendance, { foreignKey: 'member_id', onDelete: 'CASCADE' });
Attendance.belongsTo(Member, { foreignKey: 'member_id' });

Member.hasMany(Payment, { foreignKey: 'member_id', onDelete: 'CASCADE' });
Payment.belongsTo(Member, { foreignKey: 'member_id' });

// Direct Plan Associations for Member
Member.belongsTo(WorkoutPlan, { foreignKey: 'workout_plan_id', as: 'workoutPlan', onDelete: 'SET NULL' });
Member.belongsTo(DietPlan, { foreignKey: 'diet_plan_id', as: 'dietPlan', onDelete: 'SET NULL' });

// Trainer & Members
Trainer.hasMany(TrainerAssignment, { foreignKey: 'trainer_id', onDelete: 'CASCADE' });
TrainerAssignment.belongsTo(Trainer, { foreignKey: 'trainer_id' });

Member.hasMany(TrainerAssignment, { foreignKey: 'member_id', onDelete: 'CASCADE' });
TrainerAssignment.belongsTo(Member, { foreignKey: 'member_id' });

// Member & MemberPlan
Member.hasOne(MemberPlan, { foreignKey: 'member_id', onDelete: 'CASCADE' });
MemberPlan.belongsTo(Member, { foreignKey: 'member_id' });

// Workout & Diet Plans creation by User
User.hasMany(WorkoutPlan, { foreignKey: 'created_by' });
WorkoutPlan.belongsTo(User, { foreignKey: 'created_by', as: 'creator' });

User.hasMany(DietPlan, { foreignKey: 'created_by' });
DietPlan.belongsTo(User, { foreignKey: 'created_by', as: 'creator' });

module.exports = {
    sequelize,
    User,
    Member,
    MembershipPlan,
    MemberSubscription,
    Attendance,
    Payment,
    Trainer,
    MemberPlan,
    TrainerAssignment,
    WorkoutPlan,
    DietPlan
};
