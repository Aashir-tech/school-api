const app = require("./api/index");
const serverless = require("serverless-http");

export const handler = serverless(app);
