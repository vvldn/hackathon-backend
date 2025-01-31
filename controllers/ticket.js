const Ticket = require('../models/tickets');

async function getTicketDetails(req, res, next) {
  try {
    const { ticketId } = req.params;
    if (!ticketId) throw new Error('Ticket ID is required');
    const ticketDetails = await Ticket.find({id: ticketId});
    return res.send(ticketDetails);
  } catch (err) {
    return next(err);
  }
}

async function getTicketCounts(req, res, next) {
  try {
    const [totalTickets, openTickets, closedTickets, escalatedTickets] = await Promise.all([
      Ticket.countDocuments(),
      Ticket.countDocuments({ status: 'Open' }),
      Ticket.countDocuments({ status: 'Closed' }),
      Ticket.countDocuments({ status: 'Escalated' }),
    ]);
    const ticketCounts = { totalTickets, openTickets, closedTickets, escalatedTickets };
    return res.send(ticketCounts);
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  getTicketDetails,
  getTicketCounts
};
