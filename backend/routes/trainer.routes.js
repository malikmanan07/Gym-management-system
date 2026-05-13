const express = require('express');
const router = express.Router();
const { 
    getAllTrainers, 
    createTrainer, 
    updateTrainer, 
    deleteTrainer, 
    getTrainerMembers, 
    assignPlan, 
    getWorkoutPlans, 
    getDietPlans, 
    createWorkoutPlan,
    createDietPlan,
    updateWorkoutPlan,
    updateDietPlan,
    deleteWorkoutPlan, 
    deleteDietPlan 
} = require('../controllers/trainer.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

router.use(protect);

router.get('/', getAllTrainers);
router.post('/', authorize('admin'), createTrainer);
router.put('/:id', authorize('admin'), updateTrainer);
router.delete('/:id', authorize('admin'), deleteTrainer);

router.get('/:id/members', getTrainerMembers);
router.post('/assign-plan', authorize('admin', 'trainer'), assignPlan);

// Plans Management
router.get('/plans/workout', getWorkoutPlans);
router.post('/plans/workout', authorize('admin', 'trainer'), createWorkoutPlan);
router.put('/plans/workout/:id', authorize('admin', 'trainer'), updateWorkoutPlan);
router.delete('/plans/workout/:id', authorize('admin', 'trainer'), deleteWorkoutPlan);

router.get('/plans/diet', getDietPlans);
router.post('/plans/diet', authorize('admin', 'trainer'), createDietPlan);
router.put('/plans/diet/:id', authorize('admin', 'trainer'), updateDietPlan);
router.delete('/plans/diet/:id', authorize('admin', 'trainer'), deleteDietPlan);

module.exports = router;
