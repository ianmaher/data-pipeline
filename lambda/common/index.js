// Load environment variables
require('./loadEnvVars')();

const constants = require('./constants');
const responseCommon = require('./response');
const validationCommon = require('./validation');

module.exports = Object.assign(
  {},
  constants,
  responseCommon,
  validationCommon
);
