const serverless = require('serverless-http');

let cachedHandler;

module.exports = async (req, res) => {
  try {
    if (!cachedHandler) {
      const { createApp } = require('../dist/main');
      const app = await createApp();
      await app.init();
      const expressApp = app.getHttpAdapter().getInstance();
      cachedHandler = serverless(expressApp);
    }
    return await cachedHandler(req, res);
  } catch (error) {
    console.error('FATAL:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: error.message,
    });
  }
};
