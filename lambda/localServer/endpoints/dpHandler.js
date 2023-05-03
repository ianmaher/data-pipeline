const lambdaApiVersionManager = require('../../lambdaHandlers/versionManager/lambdaApiVersionManager');

// LRS Proxy to Lambda format
const dpHandler = async (query, body, headers) =>
  lambdaApiVersionManager.dpHandler({
    query,
    headers,
    body
  });
module.exports = {
  urlRegex: /^\/dp$/,
  method: 'POST',
  handler: (path, query, body, headers) => dpHandler(query, body || '', headers)
};
