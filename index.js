const dotenv = require('dotenv');

const twitch = require('./apiWrappers/twitch');
const messaging = require('./messaging');
const { MESSAGE_TOPICS } = require('./constants');

dotenv.config();
const gameName = process.env.GAME_NAME || 'PLAYERUNKNOWN\'S BATTLEGROUNDS';

const getGameCounts = name => (
	twitch.getGameViewerNumbers(name)
);

messaging.init()
	.then(() => getGameCounts(gameName))
	.then(count => messaging.sendMessages(MESSAGE_TOPICS.TWITCH, [
		{ timestamp: Date.now(), viewers: count },
		{ timestamp: Date.now(), viewers: count },
	]));
