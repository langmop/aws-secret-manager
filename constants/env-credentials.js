const credentials = {
	region: 'ap-south-1',
	credentials: {
		accessKeyId: process.env.AWSAccessKeyId,
		secretAccessKey: process.env.AWSSecretAccessKey,
	},
};

module.exports.envCredentials = credentials;
