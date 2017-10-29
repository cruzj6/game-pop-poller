/* eslint-disable no-console */

const logger = {
	error(message) {
		console.error(message);
	},

	info(message) {
		console.log(message);
	},

	warning(message) {
		console.warn(message);
	},
};

export default logger;
