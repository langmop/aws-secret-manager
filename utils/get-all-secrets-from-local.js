var getFileContent = require('./get-file-content');
var isFilePresentMethod = require('./is-file-present');

async function getAllSecretsFromLocal({ envFilePath, environment }) {
	let updatedLines = '';
	let isFilePresent = isFilePresentMethod({
		envFilePath,
		environment,
	});
	try {
		if (isFilePresent) {
			const envFileContent = await getFileContent({
				envFilePath,
			});

			const lines = envFileContent.split('\n');
			lines.forEach((line, index) => {
				if (!line.includes('# Version:') && !line.includes('# Identity:')) {
					updatedLines += line + '\n';
				}
			});
		}
	} catch (error) {
		if (error.code === 'ENOENT') {
			console.error(`.env.${environment} file does not exist`);
		} else {
			console.error(error);
		}
	}

	return updatedLines;
}

module.exports = getAllSecretsFromLocal;
