const fs = require('fs');

async function isFilePresentMethod({ envFilePath, environment }) {
	let isFilePresent = false;
	try {
		await fs.promises.access(envFilePath);
		isFilePresent = true;
	} catch (error) {
		if (error.code === 'ENOENT') {
			console.error(`.env.${environment} file does not exist`);
		} else {
			console.error(error);
		}
	}
	return isFilePresent;
}

module.exports = isFilePresentMethod;
