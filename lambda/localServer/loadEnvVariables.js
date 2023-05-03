// These env vars will be populated from pipeline params
Object.assign(process.env, {
  IS_LOCAL: 'true',
  LOG_COLOURS: 'true', // Local only
  ENV_NAME: 'dev'
});
