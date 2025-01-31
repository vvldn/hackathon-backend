const _ = require('underscore');
const promptService = require('./prompt');
const summaryJson = require('../../python_scripts/summary.json');

const openAiSupport = require('./../../support/open_ai');

const Insight = require('../../models/insight');
const ActionItem = require('../../models/action-items');

async function setInsights(_insightsJson) {
  await Insight.deleteMany({});
  const { insights } = _insightsJson;
  await Insight.insertMany(insights);
}

async function getPopulatedInsights() {
  return Insight.find({}).lean();
}

async function reGenerateInsights() {
  const summary = summaryJson;
  const keys = Object.keys(summary);
  const prompts = keys.map(key => promptService.generatePromptForOverview(summary, key));
  const openAiResponses = await Promise.all(_.map(prompts, prompt => openAiSupport.getPromptResponse(prompt, promptService.responseObject)));
  const formattedOpenAiResponses = _.flatten(_.map(openAiResponses, response => response.insights));
  const updatedInsightsJson = { insights: formattedOpenAiResponses };
  const actionItems = _.map(formattedOpenAiResponses, insight => ({ action_item_data: insight.action_item_data, action_item_type: insight.action_item_type }));
  const actionItemsInserted = await ActionItem.create(actionItems);
  const responseWithActionItemIds = [];
  _.forEach(formattedOpenAiResponses, (insight, index) => {
    responseWithActionItemIds.push({ ...insight, action_item_id: actionItemsInserted[index]._id });
  });
  setInsights(updatedInsightsJson);
  console.log('generate insights done');
  return getPopulatedInsights();
}


module.exports = {
  reGenerateInsights,
  getPopulatedInsights,
}