const fs = require('fs');

async function getFileContent({ envFilePath }) {
	const envFileContent = await fs.promises.readFile(envFilePath, 'utf8');
	return envFileContent;
}

module.exports = getFileContent;
