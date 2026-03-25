const aiService = require('../services/aiService');

const rewriteText = async (req, res, next) => {
  try {
    const { text } = req.body;
    const rewritten = await aiService.rewriteText(text);
    res.json({ result: rewritten });
  } catch (err) {
    if (err.status === 401) {
      const authErr = new Error("Invalid API Key");
      authErr.statusCode = 401;
      next(authErr);
    } else {
      next(err);
    }
  }
};

module.exports = { rewriteText };
