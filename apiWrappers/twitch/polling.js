const logger = require('../../common/logger');
const twitchMessaging = require('../../messaging/twitch');
const twitch = require('./');
const { POLLING_INTERVAL, TWITCH_LIMIT_MS } = require('../../constants');

const gameNames = process.env.GAME_NAME || ['PLAYERUNKNOWN\'S BATTLEGROUNDS', 'Diablo III: Reaper of Souls', 'League of Legends'];

// Wait before each poll to avoid rate limit
const pollTwitch = name => new Promise((resolve, reject) => (
	setTimeout(async () => {
		try {
			const count = await twitch.getGameViewerNumbers(name);
			twitchMessaging.readyMessage({ gamename: name, timestamp: Date.now(), viewers: count });

			resolve();
		} catch (err) {
			logger.error(`Error polling twitch or posting to kafka ${err}`);

			reject(err);
		}
	}, TWITCH_LIMIT_MS)
));

// poll all known twitch games
const pollAllGames = async () => {
	await Promise.all(gameNames.map(pollTwitch));

	// Empty the remaning messages
	twitchMessaging.allMessagesDone();
};

// Begin polling Twitch API on an interval
const beginPollTwitch = () => {
	pollAllGames();
	setInterval(pollAllGames, POLLING_INTERVAL);
};

module.exports = {
	beginPollTwitch,
};
