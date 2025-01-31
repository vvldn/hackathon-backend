const insightService = require('../services/insight');

async function getInsights(req, res, next) {
  try {
    const insights = await insightService.getPopulatedInsights();
    return res.send(insights);
  } catch (err) {
    return next(err);
  }
}

async function refreshInsights(req, res, next) {
  try {
    const insights = await insightService.reGenerateInsights();
    return res.send(insights);
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  getInsights,
  refreshInsights
};