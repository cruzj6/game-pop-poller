const dotenv = require('dotenv');

dotenv.config();
const logger = require('./common/logger');
const twitchPolling = require('./apiWrappers/twitch/polling');

try {
	// Init kafka messaging then begin polling
	twitchPolling.beginPollTwitch();
} catch (err) {
	logger.error('Top level caught error: ', err);
}
