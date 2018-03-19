const dotenv = require('dotenv');

dotenv.config();
const logger = require('./common/logger');
const twitchPolling = require('./apiWrappers/twitch/polling');
const messaging = require('./messaging');

try {
	console.log("ENV: ", process.env) // eslint-disable-line

	// Init kafka messaging then begin polling
	messaging.init()
		.then(twitchPolling.beginPollTwitch)
		.catch(err => logger.error('Could not initialize messaging: ', err));
} catch (err) {
	logger.error('Top level caught error: ', err);
}
