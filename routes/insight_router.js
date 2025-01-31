const insightController = require('../controllers/insight');
const express = require('express');

const router = express.Router();

router.get('/', insightController.getInsights);
router.get('/refresh', insightController.refreshInsights);

module.exports = router;