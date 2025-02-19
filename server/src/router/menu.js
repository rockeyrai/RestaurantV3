const express = require('express');
const { fetchMenu, addMenu } = require('../controller/menu');
const router = express.Router();

router.get('/menu',fetchMenu)
router.post('/menu',addMenu)


module.exports = router