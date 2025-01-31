const crypto = require('crypto');
const CryptoJS = require('crypto-js');
const axios = require('axios');

async function authenticateAndGetInsight(prompt) {
    // Request payload
const payload = {
    input: {
      text: prompt,
    },
    retrieveAndGenerateConfiguration: {
      type: 'KNOWLEDGE_BASE',
      knowledgeBaseConfiguration: {
        knowledgeBaseId: 'UNUV0BTFVO', // Replace with your Knowledge Base ID
        modelArn: 'amazon.nova-pro-v1:0', // Replace with the correct model ARN
      },
    },
  };

  // Convert payload to JSON string
const payloadString = JSON.stringify(payload);

// Generate the current timestamp in ISO 8601 format
const amzDate = new Date().toISOString().replace(/[:-]|\.\d{3}/g, '');

// Generate the hashed payload
const hashedPayload = CryptoJS.SHA256(payloadString).toString(CryptoJS.enc.Hex);

const canonicalHeaders = `content-length:${payloadString.length}\ncontent-type:${contentType}\nhost:bedrock-agent-runtime.us-east-1.amazonaws.com\nx-amz-content-sha256:${hashedPayload}\nx-amz-date:${amzDate}\nx-amz-target:${amzTarget}\n`;
const signedHeaders = 'content-length;content-type;host;x-amz-content-sha256;x-amz-date;x-amz-target';
const canonicalRequest = `${method}\n/retrieveAndGenerate\n\n${canonicalHeaders}\n${signedHeaders}\n${hashedPayload}`;

const algorithm = 'AWS4-HMAC-SHA256';
const credentialScope = `${amzDate.slice(0, 8)}/${region}/${service}/aws4_request`;
const hashedCanonicalRequest = CryptoJS.SHA256(canonicalRequest).toString(CryptoJS.enc.Hex);
const stringToSign = `${algorithm}\n${amzDate}\n${credentialScope}\n${hashedCanonicalRequest}`;

const kDate = CryptoJS.HmacSHA256(amzDate.slice(0, 8), 'AWS4' + secretAccessKey);
const kRegion = CryptoJS.HmacSHA256(region, kDate);
const kService = CryptoJS.HmacSHA256(service, kRegion);
const kSigning = CryptoJS.HmacSHA256('aws4_request', kService);
const signature = CryptoJS.HmacSHA256(stringToSign, kSigning).toString(CryptoJS.enc.Hex);

const authorizationHeader = `${algorithm} Credential=${accessKeyId}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`;

const response = await axios
  .post(endpoint, payloadString, {
    headers: {
      'Content-Type': contentType,
      'X-Amz-Date': amzDate,
      'X-Amz-Target': amzTarget,
      'X-Amz-Content-Sha256': hashedPayload,
      Authorization: authorizationHeader,
    },
  })
  .then((response) => {
    console.log('Success:', response.data);
    return response.data.output;
  })
  .catch((error) => {
    console.error('Error:', error.response ? error.response.data : error.message);
    return { text: 'Ooops! Something went wrong' };
  });

  return response;
}

// AWS credentials
const accessKeyId = '[Fill this]'; // Replace with your AWS Access Key ID
const secretAccessKey = '[Fill this]'; // Replace with your AWS Secret Access Key
const region = 'us-east-1'; // Replace with your desired AWS region
const service = 'bedrock'; // Service name for Bedrock

// API endpoint and headers
const endpoint = 'https://bedrock-agent-runtime.us-east-1.amazonaws.com/retrieveAndGenerate';
const method = 'POST';
const contentType = 'application/json';
const amzTarget = 'BedrockRuntime.KnowledgeBaseQuery';

module.exports = {
  authenticateAndGetInsight,
}

