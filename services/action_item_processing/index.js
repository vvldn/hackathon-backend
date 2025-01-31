const ActionItem = require("../../models/action_item");

const jiraSupport = require('../../support/jira');
const emailSupport = require('../../support/email');

async function createFaq() {
  return { success: true };
  // FAQ is TODO
}

async function createJiraIssue(actionItem) {
  const { action_item_data } = actionItem;
  const { title, description } = action_item_data;
  const jiraTicketResult = await jiraSupport.createTicket(title, description);
  console.log("Jira ticket result:", jiraTicketResult.success);
  return jiraTicketResult;
}

async function sendAlertEmail(actionItem) {
  const { action_item_data } = actionItem;
  const { subject, body } = action_item_data;
  const emailResult = await emailSupport.sendEmail(subject, body);
  console.log("Email result:", emailResult.success);
  return emailResult;
}

function getActionItemHandler(actionItemType) {
  switch (actionItemType) {
    case 'jira':
      return createJiraIssue;
    case 'alert':
      return sendAlertEmail;
    case 'faq':
      return createFaq;
    default:
      return null;
  }
}

async function processActionItem(actionItemId) {
  console.log("processActionItem called", actionItemId);
  const actionItem = await ActionItem.findById(actionItemId);
  if (!actionItem) {
    console.error("Action item not found");
    return { success: false };
  }
  const { action_item_type } = actionItem;
  const actionItemHandler = getActionItemHandler(action_item_type);
  if (!actionItemHandler) {
    console.error("Action item handler not found");
    return { success: false };
  }
  return actionItemHandler(actionItem);
}