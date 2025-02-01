const zod = require('zod');
const { zodResponseFormat } = require('openai/helpers/zod');
const _ = require('underscore');

/**
 * Zod Forces the LLM to respond in a specific format. 
 * This helps us from the headache of any null safety or errors for parsing.
 */
const jiraActionItemType = zod.object({
  title: zod.string(),
  description: zod.string(),
});

const faqActionItemType = zod.object({
  question: zod.string(),
  answer: zod.string(),
});

const alertActionItemType = zod.object({
  subject: zod.string(),
  body: zod.string(),
});


const Insight = zod.object({
  title: zod.string(),
  description: zod.string(),
  insights: zod.array(zod.string()),
  severity: zod.string(),
  impact: zod.string(),
  action_item_type: zod.enum(['jira', 'faq', 'alert', 'unsure']),
  action_item_data: zod.union([jiraActionItemType, faqActionItemType, alertActionItemType]),
  tickets_that_support_this: zod.array(zod.string()),
});

const Insights = zod.array(Insight);

const responseStructure = zod.object({
  insights: Insights,
});

const responseObject = zodResponseFormat(responseStructure, 'insights');

const issuePrefixes = {
  offlineIssues: 'Offline Issue',
  techAndProductIssues: 'Technical and Product Issues',
  confusingIssues: 'Confusing User Journey Issues',
};

function generatePromptForOverview(summaryJson, keyName) {
  const { keyWords } = summaryJson[keyName];
  const formattedLines = _.map(keyWords, kw => `${kw.word}:${kw.frequency}:${kw.ticket_id}`);
  const prompt = `
  Based on the following ${issuePrefixes[keyName]}, what are the action items that you would suggest?
  Try to produce 2-3 action items.
  Backup each action item you suggest with specific insights from data. Each insight has to be plain english text, try to not use direct tags read from the data.
  Also suggest the impact this action item would have, and how severe this is.

  There could be duplication in the input, account for that too. If possible, do a frequency count.

  data format: 
  keyword : frequency : ticket_id
  data:

  ${formattedLines.join('\n')}
  
  Action item can mean one of the following things:
  1) A feature that needs to be added / a bug that needs to be fixed.
    In this case, suggest a jira ticket description and title.
  2) An FAQ that needs to be added. If you think better explanation of terms and conditions could help the user, add an FAQ.
  3) Alerting the operations team about a potential issue. If a lot of users are unhappy about a specific space, alert the operations team.
  4) Unsure what needs to be done next.

  Report the response as a valid json array. No prefixes or suffixes to be added.
`;
  return prompt;
}


module.exports = {
  generatePromptForOverview,
  responseObject,
};
