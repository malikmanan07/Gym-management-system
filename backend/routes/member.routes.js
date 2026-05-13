const express = require('express');
const router = express.Router();
const { getAllMembers, getMember, createMember, updateMember, deleteMember, assignPlans } = require('../controllers/member.controller');
const { protect, authorize } = require('../middleware/auth.middleware');
const validate = require('../middleware/zod.middleware');
const { memberSchema } = require('../validations/schemas');

router.use(protect);

router.get('/', getAllMembers);
router.get('/:id', getMember);
router.post('/', authorize('admin'), validate(memberSchema), createMember);
router.put('/:id', authorize('admin'), validate(memberSchema), updateMember);
router.put('/:id/assign-plans', authorize('admin'), assignPlans);
router.delete('/:id', authorize('admin'), deleteMember);

module.exports = router;
