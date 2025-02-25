const express = require('express');
const { fetchMenu, addMenu, fetchCategorues, fetchTags, updateRating } = require('../controller/menu');
const router = express.Router();

router.get('/menu',fetchMenu)
router.post('/menu',addMenu)
router.get('/categories',fetchCategorues)
router.get('/tags',fetchTags)
router.put('/rating',updateRating);

module.exports = router