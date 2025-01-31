const axios = require("axios");
const base64 = require("base-64");

// Jira credentials (Replace with your details)
const JIRA_DOMAIN = ""; // Jira instance
const EMAIL = ""; // Your Jira email
const API_TOKEN = ""; // Your Jira API token
const projectKey = "";

const JIRA_URL = `https://${JIRA_DOMAIN}/rest/api/3/issue`;

// Function to create a Jira issue with parameters
async function createJiraIssue(summary, description, issueType) {
    console.log("createJiraIssue called");

    issueType = "Task";
    description = {
        type: "doc",
        version: 1,
        content: [
            {
                type: "paragraph",
                content: [
                    {
                        type: "text",
                        text: "This is a sample Jira issue created using the REST API."
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
        return response;

    } catch (error) {
        console.error("Error creating issue:", error.response ? error.response.data : error.message);
    }
}

// Example usage
// createJiraIssue("Issue Summary", "This is a test issue", "Task");

module.exports = { createJiraIssue };
