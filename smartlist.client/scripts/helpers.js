// helpers.js - contains helper functions
// can import this using require: const helpers = require('./helpers');


/**
 * getScriptArgs - gets the script arguments
 * @param argsToValidate {Array<string>} - optional array of arguments to validate
 * @param optionalArgs
 * @returns {Object} - the script arguments
 * {argsToValidate[0]: value, argsToValidate[1]: value, ...}
 */
function getScriptArgs(argsToValidate = [], optionalArgs = []) {
  const yargs = require('yargs/yargs');
  const { hideBin } = require('yargs/helpers');
  const argv = yargs(hideBin(process.argv)).argv;
  if (argsToValidate) {
    argsToValidate.forEach(arg => {
      if (!argv[arg]) {
        console.error(`Error: Missing required argument: ${arg}`);
        process.exit(1);
      }
    });
  }
  const args = {};
  argsToValidate.forEach(arg => {
    args[arg] = argv[arg];
  });
  optionalArgs.forEach(arg => {
    args[arg] = argv[arg] || undefined;
  });
  return args;
}

function loggerFactory(scriptName, logLevel, enableLogging = true) {
  logLevel = logLevel.toLowerCase();
  return function(...args) {
    if (!enableLogging) return;
    console[logLevel](`[${scriptName}]:`, ...args);
  };
}

function getSslHttpsPaths(appName) {
  // in posix: os.homedir() + '/.aspnet/https'
  // in windows: os.homedir() + '\\ASP.NET\\https'
  const os = require('os');
  const osType = os.type();
  const sslHttpsPath = osType === 'Windows_NT' ? os.homedir() + '\\ASP.NET\\https' : os.homedir() + '/.aspnet/https';
  if (sslHttpsPath) {
    const certFilePath = sslHttpsPath + `/${appName}.pem`;
    const keyFilePath = sslHttpsPath + `/${appName}.key`;
    return { sslHttpsPath, certFilePath, keyFilePath };
  }
  return null;
}

module.exports = {
  getScriptArgs,
  loggerFactory,
  getSslHttpsPaths
};
