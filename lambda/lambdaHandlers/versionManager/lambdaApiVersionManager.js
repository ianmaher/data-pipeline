/* eslint-disable arrow-body-style */
/* eslint-disable global-require */

const { buildFailure } = require('../../common');
const LOG = require('../../logging')('lambdaApiVersionManager');

LOG.debug('Starting...');

const dpHandler = require('../dpHandler.js');

// import versions
const {
  API_VERSION_BASE_NO_ACCEPT_HEADER,
  API_VERSION_BASE,
  API_VERSION_0_1,
  API_VERSION_0_2,
  API_VERSION_0_3,
  API_VERSION_LATEST
} = require('../../common/constants').API_VERSIONS;

// invalid api version constant
const API_VERSION_INVALID = 'INVALID_VERSION';

// list of supported versions. All valid versions should be added to this list
const API_VERSION_SUPPORTED = [
  API_VERSION_BASE_NO_ACCEPT_HEADER,
  API_VERSION_BASE,
  API_VERSION_0_1,
  API_VERSION_0_2,
  API_VERSION_0_3,
  API_VERSION_LATEST
];

// error message if api version is invalid
const API_VERSION_INVALID_ERROR = 'Invalid API version';

// returns API version from header. If version is not suported invalid version is returned
function getAPIVersion(event) {
  LOG.debug('In getAPIVersion');
  LOG.debug(`event: ${JSON.stringify(event)}`);

  const requestedAPIVersion = event.headers ? event.headers.accept : API_VERSION_BASE_NO_ACCEPT_HEADER;
  LOG.debug(`version in request header : ${requestedAPIVersion}`);
  if (!requestedAPIVersion || API_VERSION_SUPPORTED.indexOf(requestedAPIVersion) === -1) {
    // for version validation
    // if version not in supported list return Invalid version
    return API_VERSION_INVALID;
  }
  // if default version return v1
  if (requestedAPIVersion === API_VERSION_BASE_NO_ACCEPT_HEADER || requestedAPIVersion === API_VERSION_BASE) {
    return API_VERSION_0_1;
  }
  // return valid api version
  return requestedAPIVersion;
}

// export all apis for which version management is required
// in switch case, default case should be mapped to latest version of api handler
// any version not mapped to handler using switch case will map to default case
// and latest version of api will be executed
module.exports = {
  // Execute LRS Lambda Handler
  dpHandler: event => {
    switch (getAPIVersion(event)) {
      case API_VERSION_INVALID:
        return buildFailure(API_VERSION_INVALID_ERROR); // return error
      case API_VERSION_0_1:
      default:
        // for version 1 matching
        LOG.debug('Executing base API version for getLevelPanel');
        return dpHandler.handler(event);
    }
  }
};
