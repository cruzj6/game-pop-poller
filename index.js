const dotenv = require('dotenv');
const logger = require('./common/logger');
const twitchPolling = require('./apiWrappers/twitch/polling');

dotenv.config();

try {
	// Init kafka messaging then begin polling
	twitchPolling.beginPollTwitch();
} catch (err) {
	logger.error('Top level caught error: ', err);
}
