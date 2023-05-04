const get = require('lodash.get');
const set = require('lodash.set');
const LOG = require('../logging')('DP handler');

exports.handler = async event => {
  try {
    LOG.trace(`Request Event :: ${JSON.stringify(event)}`);
    const { Records: [record] = [] } = event;

    const statement = (record && record.body) || event.body || event;

    LOG.trace(`verb :: ${statement.verb}`);
    LOG.trace(`actor :: ${statement.actor}`);
    LOG.trace(`object :: ${statement.object}`);
    
    // the end
  } catch (error) {
    LOG.error('Handler Error :: ', error);
    throw new Error(`Handler Error. ${error.message}`);
  }
};
