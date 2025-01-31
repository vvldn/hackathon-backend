const ragController = require('../controllers/rag');
const express = require('express');

const router = express.Router();

router.post('/insight', ragController.getRagInsight);

module.exports = router;