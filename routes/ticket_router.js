const ticketController = require('../controllers/ticket');
const express = require('express');

const router = express.Router();

router.get('/counts', ticketController.getTicketCounts);
router.get('/:ticketId', ticketController.getTicketDetails);

module.exports = router;