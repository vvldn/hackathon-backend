const ragInsightService = require('../services/insight/rag');

async function getRagInsight(req, res, next) {
  try {
    const { prompt } = req.body;
    const insights = await ragInsightService.authenticateAndGetInsight(prompt);
    return res.send(insights);
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  getRagInsight,
};