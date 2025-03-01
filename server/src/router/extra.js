const express = require('express');
const { addOffer, addCategories, addTags } = require('../controller/extra');
const router = express.Router();

router.post('/offers',addOffer)
router.post('/categories',addCategories)
router.post('/tags',addTags)

module.exports = router