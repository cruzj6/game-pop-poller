const TWITCH_API_URL = 'https://api.twitch.tv/helix/';
const TWITCH_API_URL_V5 = 'https://api.twitch.tv/kraken/';
const TWITCH_DATA_TYPES = {
	STREAMS: 'streams',
	GAMES: 'games',
};

const MESSAGE_TOPICS = {
	TWITCH: 'twitch',
};

module.exports = {
	TWITCH_API_URL,
	TWITCH_API_URL_V5,
	TWITCH_DATA_TYPES,
	MESSAGE_TOPICS,
};
