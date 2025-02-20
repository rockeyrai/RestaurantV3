const express = require('express');
const { getTables } = require('../controller/table');
const router = express.Router();

router.get('/tables',getTables)

module.exports = router