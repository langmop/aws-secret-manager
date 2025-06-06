// built-ins
const path = require('path');
const argv = require('yargs').argv;

// third-party
const prompt = require('prompt');

// utils
const getAllSecretsFromLocal = require('./utils/get-all-secrets-from-local');
const getVersionNumber = require('./utils/get-version-local');
const getIdentityNumber = require('./utils/get-identity-number');
const fetchSecretsRemote = require('./utils/fetch-secret-remote');
const setSecretsOnRemote = require('./utils/set-secret-on-remote');
const addNewSecretFile = require('./utils/add-new-secret-file');
const updateSecretFileOnVersionUpdate = require('./utils/update-secret-file-on-version-update');
const updateLocalIdentity = require('./utils/update-local-identity');

// common-utils
const { calculateChecksum } = require('./utils/common');
const { envCredentials: credentials } = require('./constants/env-credentials');

const environment = argv.uat ? 'uat' : argv.prod ? 'prod' : 'dev';
const envFilePath = path.join(__dirname, `../env/.env.${environment}`);

async function envManger(cb) {
	const importSchema = {
		properties: {
			decision: {
				message: 'Add Yes or Y for importing else No or N to cancel',
				required: true,
			},
		},
	};

	const updateRemoteSchema = {
		properties: {
			decision: {
				message: 'Add Yes or Y for updating remote else No or N to cancel',
				required: true,
			},
		},
	};

	const versionNumber = await getVersionNumber({
		environment,
		envFilePath,
	});
	let currentEnvironmentData = await fetchSecretsRemote({
		credentials,
		environment,
	});
	let currentIdentity = await getIdentityNumber({
		environment,
		envFilePath,
	});
	if (versionNumber == (currentEnvironmentData?.VersionId || versionNumber)) {
		console.log('Remote Environment is up to date');
	} else {
		const { decision } = await prompt.get(importSchema);

		if (
			decision.toLocaleLowerCase() == 'yes' ||
			decision.toLocaleLowerCase() == 'y'
		) {
			await addNewSecretFile({
				currentEnvironmentData,
				envFilePath,
				environment,
			});
		} else {
			await updateSecretFileOnVersionUpdate({
				currentEnvironmentData,
				envFilePath,
				environment,
			});
		}
	}
	const secretsData = await getAllSecretsFromLocal({
		envFilePath,
		environment,
	});
	const calculatedIdentity = await calculateChecksum(secretsData);
	currentIdentity = await getIdentityNumber({
		environment,
		envFilePath,
	});
	if (currentIdentity == calculatedIdentity) {
		console.log('No change on local Environment');
	} else {
		console.log('Local Environment is not up to date');
		const { decision } = await prompt.get(updateRemoteSchema);

		if (
			decision.toLocaleLowerCase() == 'yes' ||
			decision.toLocaleLowerCase() == 'y'
		) {
			const oldEnvironmentData = await fetchSecretsRemote({
				credentials,
				environment,
			});
			const previousData = await fetchSecretsRemote({
				credentials,
				environment,
				versionStage: 'AWSPREVIOUS',
			});
			await setSecretsOnRemote({
				secretString: previousData?.SecretString,
				version: 'AWS_PRE_PREVIOUS',
				environment,
			});
			await setSecretsOnRemote({
				secretString: secretsData,
				environment: environment,
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
		} else {
			await updateLocalIdentity({ envFilePath, environment });
		}
	}
	cb();
}

exports.envManger = envManger;
