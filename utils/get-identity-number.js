var getFileContent = require('./get-file-content');
var isFilePresentMethod = require('./is-file-present');

async function getIdentityNumber({ envFilePath, environment }) {
	let identity = '';
	let isFilePresent = isFilePresentMethod({
		envFilePath,
		environment,
	});
	try {
		if (isFilePresent) {
			const envFileContent = await getFileContent({
				envFilePath,
			});

			const match = envFileContent.match(/^# Identity: (\S+)/m);
			identity = match ? match[1] : null;
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

	return identity;
}

module.exports = getIdentityNumber;
