const moment = require('moment');

const addNewSecretFile = require('./utils/add-new-secret-file');
const fetchSecretsRemote = require('./utils/fetch-secret-remote');
const getAllSecretsFromLocal = require('./utils/get-all-secrets-from-local');
const setSecretsOnRemote = require('./utils/set-secret-on-remote');
const argv = require('yargs').argv;
const path = require('path');

const { envCredentials: credentials } = require('./constants/env-credentials');

async function updateLatestEnv(cb) {
	const environment = argv?.uat ? 'uat' : argv?.prod ? 'prod' : 'dev';
	const envFilePath = path.join(__dirname, `../env/.env.${environment}`);

	let currentEnvironmentData = await fetchSecretsRemote({
		credentials,
		environment,
	});

	let oldEnvironmentData = currentEnvironmentData;

	const secretsData = await getAllSecretsFromLocal({
		envFilePath,
		environment,
	});

	const previousData = await fetchSecretsRemote({
		credentials,
		environment,
		versionStage: 'AWSPREVIOUS',
	});
	await setSecretsOnRemote({
		secretString: previousData.SecretString,
		version: 'AWS_PRE_PREVIOUS',
		environment,
	});
	await setSecretsOnRemote({
		secretString: secretsData,
		environment,
	});

	currentEnvironmentData = await fetchSecretsRemote({
		credentials,
		environment,
	});

	await addNewSecretFile({
		currentEnvironmentData,
		envFilePath,
		environment,
		oldEnvironmentData,
	});
	cb();
}

module.exports.updateLatestEnv = updateLatestEnv;
