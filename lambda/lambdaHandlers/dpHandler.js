const get = require('lodash.get');
const set = require('lodash.set');
const LOG = require('../logging')('DP handler');

exports.handler = async event => {
  try {
    LOG.trace(`Request Event :: ${JSON.stringify(event)}`);
    const { Records: [record] = [] } = event;

    const statement = (record && JSON.parse(record.body)) || event.body || event;
    LOG.trace(`statement :: ${JSON.stringify(statement)}`);

   
    // the end
  } catch (error) {
    LOG.error('Handler Error :: ', error);
    throw new Error(`Handler Error. ${error.message}`);
  }
};
