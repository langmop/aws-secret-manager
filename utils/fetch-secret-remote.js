const {
	GetSecretValueCommand,
	SecretsManagerClient,
} = require('@aws-sdk/client-secrets-manager');

async function fetchSecretsRemote({
	credentials,
	environment = 'dev',
	versionId = '',
	versionStage = 'AWSCURRENT',
}) {
	try {
		const client = new SecretsManagerClient(credentials);

		const response = await client.send(
			new GetSecretValueCommand({
				SecretId: `${environment}/frontend/admin-v2/env_file`,
				...(versionId ? {} : { VersionStage: versionStage }),
				...(versionId ? { VersionId: versionId } : {}),
			})
		);

		return response;
	} catch (error) {
		console.error('error while fetching secrets', error);
	}
}

module.exports = fetchSecretsRemote;
