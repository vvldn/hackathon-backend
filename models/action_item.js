const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const actionItemSchema = new Schema({
    "title": { type: String, required: true },
    "description": { type: String, required: true },
    "insights": { type: [String] },
    "severity": { type: String },
    "impact": { type: String },
    "action_item_type": { type: String },
    "action_item_data": { type: Object },
    "tickets_that_support_this": { type: [String] }
});

const ActionItem = mongoose.model('ActionItem', actionItemSchema, 'actionitem');

module.exports = ActionItem;