const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const insightSchema = new Schema({
    "title": { type: String, required: true },
    "description": { type: String, required: true },
    "insights": { type: [String] },
    "severity": { type: String },
    "impact": { type: String },
    "action_item_type": { type: String },
    "action_item_id": { type: Schema.ObjectId, ref: 'ActionItem' },
    "action_item_data": { type: Object },
    "tickets_that_support_this": { type: [String] }
});

const Insight = mongoose.model('Insight', insightSchema, 'insights');

module.exports = Insight;