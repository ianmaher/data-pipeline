const LEVELS = {
  TRACE: 0,
  DEBUG: 1,
  INFO: 2,
  WARNING: 3,
  ERROR: 4,
  NONE: 5
};

const log = (level, colour, funcname, message, ...args) => {
  const logLevel = process.env.LOG_LEVEL || 'TRACE';
  const logColours = process.env.LOG_COLOURS === 'true';

  if (typeof LEVELS[logLevel] === 'undefined') {
    console.warn('Unknown LOG_LEVEL:', logLevel, 'Expected one of:', Object.keys(LEVELS).join(', '));
  } else if (LEVELS[logLevel] !== LEVELS.NONE && LEVELS[level] >= LEVELS[logLevel]) {
    console.log(
      `${logColours ? colour : ''}[${level}] [${funcname}] ${message}`,
      ...args,
      `${logColours ? '\x1b[0m' : ''}`
    );
  }
};

module.exports = funcname => ({
  trace: log.bind(this, 'TRACE', '\x1b[36m', funcname),
  debug: log.bind(this, 'DEBUG', '\x1b[34m', funcname),
  info: log.bind(this, 'INFO', '\x1b[32m', funcname),
  warn: log.bind(this, 'WARNING', '\x1b[33m', funcname),
  error: log.bind(this, 'ERROR', '\x1b[31m', funcname)
});
