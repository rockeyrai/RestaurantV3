const express = require('express');
const { getTables, saveTableReservation, fetchTableAdmin } = require('../controller/table');
const router = express.Router();

router.get('/tables',getTables)
router.post("/tables",saveTableReservation)
router.get('/admin/tables',fetchTableAdmin)

module.exports = router