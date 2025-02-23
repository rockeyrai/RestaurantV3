const express = require('express');
const { addOrder } = require('../controller/order');
const router = express.Router();


router.post('/order',addOrder)

module.exports = router