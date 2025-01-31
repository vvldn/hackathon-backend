const openAi = require('openai');

const properties = require('../bin/properties');

let clientObj;

const model = 'gpt-4o';

function getClient() {
  if (clientObj) return clientObj;
  clientObj = new openAi.OpenAI({ apiKey: properties.prod.openAiApiKey });
  return clientObj;
}

async function getPromptResponse(prompt, responseFormat) {
  const client = getClient();
  const messages = [
    { role: 'system', content: 'You analyze tabular data and come up with actionable insights' },
    { role: 'user', content: prompt },
  ];

  const response = await client.beta.chat.completions.parse({
    messages, model,
    response_format: responseFormat, 
  });


  const { choices } = response;
  const [choice] = choices;
  return JSON.parse(choice.message.content);
}

module.exports = {
  getPromptResponse,
};
