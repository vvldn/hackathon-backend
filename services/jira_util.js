const axios = require("axios");
const base64 = require("base-64");

// Jira credentials (Replace with your details)
const JIRA_DOMAIN = "your-domain.atlassian.net"; // Jira instance
const EMAIL = "your-email@example.com"; // Your Jira email
const API_TOKEN = "your-api-token"; // Your Jira API token

const JIRA_URL = `https://${JIRA_DOMAIN}/rest/api/3/issue`;

// Function to create a Jira issue with parameters
async function createJiraIssue(projectKey, summary, description, issueType) {
  try {
    // Construct issue data
    const issueData = {
      fields: {
        project: { key: projectKey },
        summary: summary,
        description: description,
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
  } catch (error) {
    console.error("Error creating issue:", error.response ? error.response.data : error.message);
  }
}

// Example usage
createJiraIssue("PROJECT_KEY", "Issue Summary", "This is a test issue", "Task");
