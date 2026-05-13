const express = require('express');
const router = express.Router();
const { markAttendance, getLogs, deleteLog } = require('../controllers/attendance.controller');
const { protect } = require('../middleware/auth.middleware');
const validate = require('../middleware/zod.middleware');
const { attendanceSchema } = require('../validations/schemas');

router.use(protect);

router.post('/mark', validate(attendanceSchema), markAttendance);
router.get('/logs', getLogs);
router.delete('/:id', deleteLog);

module.exports = router;
