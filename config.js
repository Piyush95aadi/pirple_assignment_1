/*
* Create and export configuration variables
*/

// Container for all the environments
let environments = {};

// Staging (default) environment
environments.staging = {
	'port': 5000,
	'envName': 'staging'
}

// Determine which environment was passed in command-line argument
let currentEnv = typeof(process.env.NODE_ENV) === 'string' ? process.env.NODE_ENV.toLowerCase(): '';

// Check that the current environment is one of the environment from above, if not, default to staging
let envToExport = typeof(environments[currentEnv]) !== 'undefined' ? environments[currentEnv] : environments.staging;

module.exports = envToExport;

