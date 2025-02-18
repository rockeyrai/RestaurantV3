const express = require('express');
const { fetchMenu } = require('../controller/menu');
const router = express.Router();

router.get('/menu',fetchMenu)


module.exports = router