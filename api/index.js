const { app, connectAndStart } = require('../server/index');

let isConnected = false;

module.exports = async (req, res) => {
  if (!isConnected) {
    await connectAndStart();
    isConnected = true;
  }
  return app(req, res);
};
