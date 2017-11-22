/* eslint-disable no-console */

const logger = {
	info(message) {
		console.log(message);
	},

	warning(message) {
		console.warn(message);
	},

	error(message) {
		console.error(`ERROR ${message}`);
	},

	success(message) {
		this.info(`SUCCESS: ${message}`);
	},

	failure(message) {
		this.info(`FAILURE: ${message}`);
	},
};

module.exports = logger;
