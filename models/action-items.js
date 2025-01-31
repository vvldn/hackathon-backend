const mongoose = require('mongoose');
const { Schema } = mongoose;
const { actionItemStatus } = require('../enum');

const actionItemSchema = new Schema({
  action_item_type: { type: String, required: true },
  action_item_data: {
    title: { type: String },
    description: { type: String }
  },
  status: { type: String, required: true, enum: Object.values(actionItemStatus), default: actionItemStatus.CREATED },
}, { strict: false });

module.exports = mongoose.model('ActionItems', actionItemSchema, 'action-items');