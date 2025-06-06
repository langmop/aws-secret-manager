var isFilePresentMethod = require('./is-file-present');
var getFileContent = require('./get-file-content');
var getAllSecretsFromLocal = require('./get-all-secrets-from-local');
var { calculateChecksum } = require('./common');
var fs = require('fs');

async function updateLocalIdentity({ envFilePath, environment }) {
	let isFilePresent = isFilePresentMethod({
		envFilePath,
		environment,
	});

	try {
		if (isFilePresent) {
			const envFileContent = await getFileContent({
				envFilePath,
			});
			const updatedLines = await getAllSecretsFromLocal({
				envFilePath,
				environment,
			});
			const checksum = await calculateChecksum(updatedLines);

			const updatedContent = envFileContent?.replace(
				/^# Identity: .*/m,
				`# Identity: ${checksum} -updated`
			);

			await fs.promises.writeFile(envFilePath, updatedContent);
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

module.exports = updateLocalIdentity;
