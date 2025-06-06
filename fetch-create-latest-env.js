const { envCredentials: credentials } = require('./constants/env-credentials');
const argv = require('yargs').argv;
const path = require('path');

const addNewSecretFile = require('./utils/add-new-secret-file');
const fetchSecretsRemote = require('./utils/fetch-secret-remote');

async function fetchCreateLatestEnv(cb) {
	const environment = argv?.uat ? 'uat' : argv?.prod ? 'prod' : 'dev';
	const envVersion = argv?.envVersion
		? process.argv[process?.argv?.length - 1]
		: '';

	let currentEnvironmentData = await fetchSecretsRemote({
		credentials,
		environment,
		versionId: envVersion,
	});

	await addNewSecretFile({
		currentEnvironmentData,
		envFilePath: path.join(
			__dirname,
			`../env/.env.${environment}${envVersion ? `-${envVersion}` : ''}`
		),
		environment,
	});
	cb();
}

module.exports.fetchCreateLatestEnv = fetchCreateLatestEnv;
