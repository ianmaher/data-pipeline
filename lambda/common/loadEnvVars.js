module.exports = () => {
  try {
    // Load environment variables from file defined as override in CodePipeline - fileName must match the env name
    /* eslint-disable global-require, import/no-dynamic-require */
    const envVars = require(`../environmentVars/${process.env.ENV_NAME}`);

    // assign vars to process.env
    const mergedVars = Object.assign(
      process.env,
      {},
      {
      }
    );

    return mergedVars;
  } catch (err) {
    const loadErrorDetails = `Could not load file ${process.env.ENV_NAME}.json`;
    throw new Error(loadErrorDetails, err);
  }

  /* eslint consistent-return:off */
};
