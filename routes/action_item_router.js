const actionItemController = require('../controllers/action_item.js');
const express = require('express');

const router = express.Router();

router.get('/', actionItemController.getAllActionItems);
router.get('/:actionItemId', actionItemController.getActionItem);
router.put('/:actionItemId', actionItemController.processItem);
router.delete('/:actionItemId', actionItemController.deleteItem);


module.exports = router;