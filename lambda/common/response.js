const LOG = require('../logging')('Common-Response');

const buildFailure = data => ({
  status: 'fail',
  data
});

const buildError = (message, code) => {
  LOG.debug('buildError', message, code);
  return {
    status: 'error',
    message, // Required
    code // Optional
  };
};

const buildSuccess = data => ({
  status: 'success',
  data
});

// Build error response, passing error message and error code if available:
const unknownError = error => buildError(error.message, error.code || (parseInt(error.status, 10) && error.status));

const concatErrorMessages = errorMessages => {
  const errors = [];

  Object.keys(errorMessages).forEach(code => {
    errors.push(`[[${code}][${errorMessages[code]}]]`);
  });

  return errors.join('\n');
};

const handleGenericError = (callback, err) => {
  LOG.debug('Got an error in response validation', err);
  callback(null, buildError(err.message));
};

module.exports = {
  unknownError,
  buildFailure,
  buildError,
  buildSuccess,
  concatErrorMessages,
  handleGenericError
};
