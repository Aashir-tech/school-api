const app = require('./index');
const serverless = require('serverless-http');

export const handler = serverless(app);