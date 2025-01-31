const ActionItem = require('../models/action-items');
const { actionItemStatus } = require('../enum');

async function getActionItem(req, res, next) {
  try {
    const { actionItemId } = req.params;
    if (!actionItemId) throw new Error('Action Item ID is required');
    const actionItem = ActionItem.findById(actionItemId).lean();
    return res.send(actionItem);
  } catch (err) {
    return next(err);
  }
}

async function processItem(req, res, next) {
  try {
    const { actionItemId } = req.params;
    if (!actionItemId) throw new Error('Action Item ID is required');
    await ActionItem.findByIdAndUpdate({ _id: actionItemId }, { status: actionItemStatus.REJECTED });
    return res.send({ success: true });
  } catch (err) {
    return next(err);
  }
}

async function deleteItem(req, res, next) {
  try {
    const { actionItemId } = req.params;
    if (!actionItemId) throw new Error('Action Item ID is required');
    await ActionItem.findByIdAndUpdate({ _id: actionItemId }, { status: actionItemStatus.REJECTED });
    return res.send({ success: true });
  } catch (err) {
    return next(err);
  }
}

async function getAllActionItems(req, res, next) {
  try {
    const { actionItemStatus } = req.query;
    if (!actionItemStatus) throw new Error('Action Item Type is required');
    const actionItems = await ActionItem.find({ status: actionItemStatus }).lean();
    return res.send(actionItems);
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  getActionItem,
  processItem,
  deleteItem,
  getAllActionItems
};