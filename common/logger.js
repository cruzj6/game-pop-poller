/* eslint-disable no-console */

const logger = {
	info(message, data) {
		console.log(message, data);
	},

	warning(message, data) {
		console.warn(message, data);
	},

	error(message, data) {
		console.error(`ERROR ${message}`, data);
	},

	success(message, data) {
		this.info(`SUCCESS: ${message}`, data);
	},

	failure(message, data) {
		this.info(`FAILURE: ${message}`, data);
	},
};

module.exports = logger;
