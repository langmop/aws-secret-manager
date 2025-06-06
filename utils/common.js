var crypto = require('crypto');

async function calculateChecksum(secrets = '') {
	const hash = crypto.createHash('sha256');
	hash.update(secrets?.trim());
	const checksum = hash.digest('hex');
	return checksum;
}

module.exports = {
	calculateChecksum,
};
