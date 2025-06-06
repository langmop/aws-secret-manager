var isFilePresentMethod = require('./is-file-present');
var getAllSecretsFromLocal = require('./get-all-secrets-from-local');
var fs = require('fs');
var { calculateChecksum } = require('./common');

async function updateSecretFileOnVersionUpdate({
	currentEnvironmentData,
	envFilePath,
	environment,
}) {
	let isFilePresent = isFilePresentMethod({
		envFilePath,
		environment,
	});
	try {
		if (isFilePresent) {
			const updatedLines = await getAllSecretsFromLocal({
				envFilePath,
				environment,
			});
			const checksum = await calculateChecksum(updatedLines);

			// Add the updated version at the top
			lines = [];
			lines.unshift(updatedLines);
			lines.unshift(
				`# Version: ${currentEnvironmentData?.VersionId} -updated\n# Identity: ${checksum}`
			);
			await fs.promises.writeFile(envFilePath, lines.join('\n'));
		} else {
			console.error(`.env.${environment} file does not exist`);
		}
	} catch (error) {
		if (error.code === 'ENOENT') {
			console.error(`.env.${environment} file does not exist`);
		} else {
			console.error(error);
		}
	}
}

module.exports = updateSecretFileOnVersionUpdate;
