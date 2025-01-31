async function getInsights(req, res, next) {
  try {
    const insights = {};
    return res.send(insights);
  } catch (err) {
    return next(err);
  }
}

async function refreshInsights(req, res, next) {
  try {
    const insights = {};
    return res.send(insights);
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  getInsights,
  refreshInsights
};