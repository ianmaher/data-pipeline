// KOA DOCS:
// https://github.com/alexmingoia/koa-router/tree/master/
/* eslint import/no-extraneous-dependencies:0 */

require('./loadEnvVariables.js');

const Koa = require('koa');
const bodyParser = require('koa-bodyparser');

const app = new Koa();

app.use(
  bodyParser({
    enableTypes: ['json', 'form', 'text']
  })
);

const endpoints = require('./endpoints');

app.use(async ctx => {
  console.log('\n\n[router] Request details:');

  // Capture request details
  const { path, method, query, headers, body } = ctx.request;

  console.log(`  - Path: ${path}`);
  console.log(`  - Method: ${method}`);
  console.log(`  - Query:`, JSON.stringify(query, null, '  '));
  console.log(`  - Headers:`, JSON.stringify(headers, null, '  '));
  console.log(`  - Body:`, JSON.stringify(body, null, '  '));

  const abacHeaders = {
    sessionToken: headers['x-amz-security-token'],
    apiKey: headers['x-api-key'],
    accessKeyId: headers['x-access-key-id'],
    secretAccessKey: headers['x-secret-access-key'],
    authorization: headers.authorization,
    'cognito-id': headers['cognito-id'],
    'accept-language': headers['accept-language'],
    accept: headers.accept
  };

  ctx.set('Access-Control-Allow-Origin', '*');
  ctx.set('Access-Control-Allow-Methods', 'GET,HEAD,PUT,POST,DELETE,PATCH');
  ctx.set(
    'Access-Control-Allow-Headers',
    'accept,accept-language,authorization,content-type,x-amz-date,X-Api-Key,X-Access-Key-Id,X-Secret-Access-Key,x-amz-security-token,cognito-id'
  );

  const returnHtml = headers.accept === 'text/html';

  let returnData;

  try {
    if (method === 'OPTIONS') {
      returnData = 'Request was for HTTP OPTIONS';
    } else {
      let validEndpoint = false;
      /* eslint-disable no-restricted-syntax, no-await-in-loop, no-loop-func */
      for (const endpoint of endpoints) {
        if (endpoint.urlRegex.test(path) && (!endpoint.method || endpoint.method === method)) {
          // eslint-disable-next-line prefer-destructuring
          const supportsHtml = endpoint.supportsHtml;
          ctx.type = returnHtml && supportsHtml ? 'text/html' : 'application/json';

          // Request is for this endpoint
          await endpoint
            .handler(path, query, body, abacHeaders)
            .then(data => {
              returnData = data;
            })
            .catch(error => {
              console.log('[devServer] Lambda return error:', error);
              ctx.status = error.httpStatus;
              delete error.httpStatus;
              returnData = error;
            });

          validEndpoint = true;
        }
      }
      if (!validEndpoint) {
        console.log(`[handlerNotFound] Handler not found for URL: ${path}`);
        ctx.status = 404;
        returnData = {
          message: 'Access denied?'
        };
      }
    }
  } catch (error) {
    console.log('[koaCatch] Koa dev server error thrown:', error);
    returnData = {
      status: 'fail',
      koaCatch: true,
      error
    };
  }

  console.log('[router] Returning data: ', JSON.stringify(returnData, null, '  '));
  ctx.body = returnData;
});

console.log('Lambda dev server starting on port 7801...');
app.listen(7801);
