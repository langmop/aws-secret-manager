// built-ins
var fs = require('fs');
var path = require('path');

// third-party
var moment = require('moment');

// utils
var isFilePresentMethod = require('./is-file-present');
var { calculateChecksum } = require('./common');

async function addNewSecretFile({
	currentEnvironmentData,
	envFilePath,
	oldEnvironmentData,
	environment,
}) {
	let isFilePresent = await isFilePresentMethod({
		envFilePath,
		environment,
	});

	// this only has two task copy and write the latest env file
	try {
		if (isFilePresent) {
			const now = new Date();
			const timestamp = moment(now).format('DD-MM-YYYY-hh-mm-ss');
			const dirName = path.resolve(__dirname, `../../env/${environment}`);

			await fs.promises.mkdir(dirName, { recursive: true });

			await fs.promises.copyFile(
				envFilePath,
				path.join(dirName, `/.env.${environment}.previous.${timestamp}`)
			);

			if (oldEnvironmentData) {
				const checksum = await calculateChecksum(
					oldEnvironmentData?.SecretString
				);
				return await fs.promises.writeFile(
					path.join(dirName, `/.env.${environment}.previous.${timestamp}`),
					`# Version: ${
						oldEnvironmentData?.VersionId
					}\n# Identity: ${checksum}\n${oldEnvironmentData?.SecretString?.trim()}`
				);
			}
		}
		const checksum = await calculateChecksum(
			await currentEnvironmentData?.SecretString
		);

		return await fs.promises.writeFile(
			envFilePath,
			`# Version: ${
				currentEnvironmentData?.VersionId
			}\n# Identity: ${checksum}\n${currentEnvironmentData?.SecretString.trim()}`
		);
	} catch (error) {
		if (error.code === 'ENOENT') {
			const checksum = await calculateChecksum(
				await currentEnvironmentData?.SecretString
			);
			fs.promises.writeFile(
				envFilePath,
				`# Version: ${
					currentEnvironmentData?.VersionId
				}\n# Identity: ${checksum}\n${currentEnvironmentData?.SecretString?.trim()}`
			);
			console.error(`.env.${environment} file does not exist`);
		} else {
			console.error(error);
		}
	}
}

module.exports = addNewSecretFile;
