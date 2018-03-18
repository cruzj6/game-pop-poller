const R = require('ramda');
const logger = require('../../common/logger');
const twitchMessaging = require('../../messaging/twitch');
const twitch = require('./');
const { POLLING_INTERVAL, TWITCH_LIMIT_MS, MAX_TOP_GAMES } = require('../../constants');

// const gameNames = process.env.GAME_NAME || ['PLAYERUNKNOWN\'S BATTLEGROUNDS', 'Diablo III: Reaper of Souls', 'League of Legends'];

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

// poll top MAX_TOP_GAMES twitch games
const pollAllGames = async () => {
	try {
		const topGames = await twitch.getTopGames(MAX_TOP_GAMES);
		const topGameNames = topGames.map(R.path(['name']));

		// build chain to poll for each game
		await topGameNames.reduce((chain, name) => chain
			.then(() => pollTwitch(name))
			.catch(() => logger.error('Could not poll for game: ', name)), Promise.resolve());
	} catch (err) {
		logger.error('Could not poll top games: ', err);
	}

	// Empty the remaning messages
	twitchMessaging.allMessagesDone();
};

// Begin polling Twitch API on an interval
const beginPollTwitch = () => {
	pollAllGames();
	setInterval(async () => {
		try {
			await pollAllGames();
		} catch (err) {
			logger.error('Error on polling all games: ', err);
		}
	}, POLLING_INTERVAL);
};

module.exports = {
	beginPollTwitch,
};
