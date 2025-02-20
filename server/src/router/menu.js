const express = require('express');
const { fetchMenu, addMenu, fetchCategorues, fetchTags } = require('../controller/menu');
const router = express.Router();

router.get('/menu',fetchMenu)
router.post('/menu',addMenu)
router.get('/categories',fetchCategorues)
router.get('/tags',fetchTags)


module.exports = router