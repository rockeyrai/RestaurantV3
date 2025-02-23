const express = require('express');
const router = express.Router();
const { getStaffWithSchedule } = require('../controller/employee');

// Route to fetch staff with schedules
router.get('/employee', getStaffWithSchedule);

module.exports = router;
