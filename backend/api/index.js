const serverless = require('serverless-http');

let cachedHandler;

module.exports = async (req, res) => {
  if (!cachedHandler) {
    const { createApp } = require('../dist/main');
    const app = await createApp();
    await app.init();
    cachedHandler = serverless(app.getHttpAdapter().getInstance());
  }
  return cachedHandler(req, res);
};
