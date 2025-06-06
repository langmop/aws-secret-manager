const getFileContent = require('./get-file-content');
const isFilePresentMethod = require('./is-file-present');

async function getVersionNumber({ envFilePath, environment }) {
	let versionNumber = '';
	let isFilePresent = isFilePresentMethod({
		envFilePath,
		environment,
	});

	try {
		if (isFilePresent) {
			const envFileContent = await getFileContent({
				envFilePath,
			});

			const match = envFileContent?.match(/^# Version: (\S+)/m);
			versionNumber = match ? match[1] : '';
		}
	} catch (error) {
		if (error.code === 'ENOENT') {
			console.error(`.env.${environment} file does not exist`);
		} else {
			console.error(error);
		}
	}

	return versionNumber;
}

module.exports = getVersionNumber;
