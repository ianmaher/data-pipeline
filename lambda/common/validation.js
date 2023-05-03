const { Validator } = require('jsonschema');
const { buildFailure } = require('./response');

const validateAgainstSchema = (schema, request) => {
  const v = new Validator();

  const result = v.validate(request, schema, { propertyName: 'request' });

  let validationError = false;

  if (result.errors.length) {
    const data = {};

    result.errors.forEach(error => {
      data[error.property] = error.message;
    });

    validationError = buildFailure(data);
  }

  return validationError;
};

module.exports = {
  validateAgainstSchema
};
