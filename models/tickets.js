const mongoose = require('mongoose');
const { Schema } = mongoose;

const ticketSchema = new Schema({}, { strict: false });

module.exports = mongoose.model('Tickets', ticketSchema, 'tickets');