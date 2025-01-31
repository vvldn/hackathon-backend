const promptService = require('./prompt');
const summaryJson = require('../../python_scripts/summary.json');

const openAiSupport = require('./../../support/open_ai');

let insightsJson = {};

function setInsights(_insightsJson) {
  insightsJson = _insightsJson;
}

async function getPopulatedInsights() {
  // DB Lookups happen here.
  return insightsJson;
}

async function reGenerateInsights() {
  const summary = summaryJson;
  const keys = Object.keys(summary);
  const prompts = keys.map(key => promptService.generatePromptForOverview(summary, key));
  const openAiResponses = await Promise.all(_.map(prompts, prompt => openAiSupport.getPromptResponse(prompt, promptService.responseObject)));
  const formattedOpenAiResponses = _.flatten(_.map(openAiResponses, response => response.insights));
  const updatedInsightsJson = { insights: formattedOpenAiResponses };
  // const actionItems = _.map(formattedOpenAiResponses, insight => { actionItemData: insight.action_item_data, actionItemType: insight.action_item_type });
  // const storedActionItems = await Promise.all(_.map(actionItems, storeActionItems));
  // const responseWithActionItemIds = [];
  setInsights(updatedInsightsJson);
  return getPopulatedInsights();
}


module.exports = {
  reGenerateInsights,
  getPopulatedInsights,
}