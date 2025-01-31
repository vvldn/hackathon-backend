const axios = require("axios");
const base64 = require("base-64");
const properties = require("../bin/properties");

const JIRA_DOMAIN = properties.db_properties.prod.jiraDomain;
const EMAIL = properties.db_properties.prod.jiraEmail;
const API_TOKEN = properties.db_properties.prod.jiraToken;
const projectKey = properties.db_properties.prod.jiraProjectKey;

const JIRA_URL = `https://${JIRA_DOMAIN}/rest/api/3/issue`;

async function createTicket(summary, descriptionText) {
  console.log("createJiraIssue called");
  const issueType = "Task";
  const description = {
    type: "doc", version: 1,
    content: [
      {
        type: "paragraph",
        content: [
          {
            type: "text",
            text: descriptionText
          }
        ]
      }
    ]
  };

  try {
    // Construct issue data
    const issueData = {
      fields: {
        project: { key: projectKey },
        summary, description,
        issuetype: { name: issueType }
      }
    };

    // API request headers
    const headers = {
      "Accept": "application/json",
      "Content-Type": "application/json",
      "Authorization": `Basic ${base64.encode(`${EMAIL}:${API_TOKEN}`)}`
    };

    // Send API request
    const response = await axios.post(JIRA_URL, issueData, { headers });
    console.log("Issue created successfully:", response.data);
    return { success: true };
  } catch (error) {
    console.error("Error creating issue:", error.response ? error.response.data : error.message);
  }
}

module.exports = { createTicket };
