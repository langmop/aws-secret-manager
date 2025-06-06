const {
	SecretsManagerClient,
	PutSecretValueCommand,
} = require('@aws-sdk/client-secrets-manager');
var { envCredentials: credentials } = require('../constants/env-credentials');

async function setSecretsOnRemote({
	secretString,
	version = 'AWSCURRENT',
	environment,
}) {
	try {
		const client = new SecretsManagerClient(credentials);

		const response = await client.send(
			new PutSecretValueCommand({
				SecretId: `${environment}/frontend/admin-v2/env_file`,
				SecretString: secretString,
				VersionStages: [version],
			})
		);

		return response;
	} catch (error) {
		console.error(error);
	}
}

module.exports = setSecretsOnRemote;
