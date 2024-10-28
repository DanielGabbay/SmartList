const fs = require('fs');
const path = require('path');
const os = require('os');
const {spawn} = require('child_process');
const helpers = require('./helpers');
const {env} = require('process');
/* -------------------------------------------------------------------------------------------------------------- */
// script arguments: hostApp, devRemotes, debug
const args = helpers.getScriptArgs(['hostApp'], ['devRemotes', 'debug']);
const {hostApp} = args;
let {devRemotes, debug} = args;
debug = !['false', '0', 'undefined'].includes(debug) && Boolean(debug);

/* -------------------------------------------------------------------------------------------------------------- */
const logger = helpers.loggerFactory('start.js', 'DEBUG', debug);
const errorLogger = helpers.loggerFactory('start.js', 'ERROR', debug);

/* -------------------------------------------------------------------------------------------------------------- */
// Get the target server URL from the environment variables or default
let targetServerUrl = env.ASPNETCORE_HTTPS_PORT
  ? `https://localhost:${env.ASPNETCORE_HTTPS_PORT}`
  : env.ASPNETCORE_URLS
    ? env.ASPNETCORE_URLS.split(';')[0]
    : undefined;

if (!targetServerUrl) {
  targetServerUrl = 'https://localhost:7105';
  logger('Target Server URL not found in environment variables. Using default:', targetServerUrl);
} else {
  logger(`Target Server URL: ${targetServerUrl}`);
}

/* -------------------------------------------------------------------------------------------------------------- */

// Get SSL certificate paths based on the OS
function getSslHttpsPaths(appName) {
  const osType = os.type();
  const sslHttpsPath =
    osType === 'Windows_NT'
      ? path.join(os.homedir(), 'ASP.NET', 'https')
      : path.join(os.homedir(), '.aspnet', 'https');
  if (sslHttpsPath) {
    const certFilePath = path.join(sslHttpsPath, `${appName}.pem`);
    const keyFilePath = path.join(sslHttpsPath, `${appName}.key`);
    return {sslHttpsPath, certFilePath, keyFilePath};
  }
  return null;
}

const _sslHttpsPath = getSslHttpsPaths(hostApp);
if (!_sslHttpsPath) {
  errorLogger('❌ SSL path not found.');
  process.exit(1);
}
const {sslHttpsPath, certFilePath, keyFilePath} = _sslHttpsPath;
console.log("sslHttpsPath", _sslHttpsPath);

/* -------------------------------------------------------------------------------------------------------------- */

// Check if the SSL files exist, if not create them
function ensureSslCertificates() {

  return new Promise((resolve, reject) => {
    if (!fs.existsSync(certFilePath) || !fs.existsSync(keyFilePath)) {
      if (!fs.existsSync(sslHttpsPath)) {
        fs.mkdirSync(sslHttpsPath, {recursive: true});
      }
      console.log('⁉️ Certificate or key file not found. Attempting to create certificate...');
      const dotnetProcess = spawn('dotnet', [
        'dev-certs',
        'https',
        '--export-path',
        certFilePath,
        '--format',
        'PEM',
        '--no-password'
      ], {stdio: 'inherit'});

      dotnetProcess.on('exit', (code) => {
        if (code !== 0) {
          console.error('❌ Failed to create certificate.');
          reject(new Error('Failed to create certificate'));
        } else {
          console.log('✅ Certificate created successfully.');
          resolve();
        }
      });
    } else {
      console.log('✅ Certificate and key files found.');
      resolve();
    }
  });
}

/* -------------------------------------------------------------------------------------------------------------- */

// Start the NX server
function startNxServer() {
  const projectRoot = process.cwd();
  const relativeCertFilePath = path.relative(projectRoot, certFilePath);
  const relativeKeyFilePath = path.relative(projectRoot, keyFilePath);

  const spawnArgs = [
    'nx',
    'serve',
    hostApp,
    '--ssl',
    '--sslCert',
    relativeCertFilePath,
    '--sslKey',
    relativeKeyFilePath
  ];

  if (devRemotes) {
    if (Array.isArray(devRemotes)) {
      devRemotes = devRemotes.join(',');
    }
    spawnArgs.push(`--devRemotes=${devRemotes}`);
  }

  console.log('Starting Client NX applications with SSL:', spawnArgs);

  const clientApp = spawn('npx', spawnArgs, {stdio: 'inherit', shell: true});
  clientApp.on('exit', (code) => {
    console.log('Client NX applications exited with code:', code);
    process.exit(code);
  });
}

/* -------------------------------------------------------------------------------------------------------------- */
// Main logic
ensureSslCertificates()
  .then(() => {
    console.log(`✅ SSL setup completed. Starting NX server for ${hostApp}...`);
    startNxServer();
  })
  .catch((error) => {
    errorLogger('Error occurred:', error);
    process.exit(1);
  });
