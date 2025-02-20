const express = require('express');
const { getTables, saveTableReservation } = require('../controller/table');
const router = express.Router();

router.get('/tables',getTables)
router.post("/tables",saveTableReservation)

module.exports = router