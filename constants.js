const { NODE_ENV } = process.env;
const isProduction = NODE_ENV === 'production';

// Twitch API
const TWITCH_API_URL = 'https://api.twitch.tv/helix/';
const TWITCH_API_URL_V5 = 'https://api.twitch.tv/kraken/';
const TWITCH_DATA_TYPES = {
	STREAMS: 'streams',
	GAMES: 'games',
};

// Kafka
const MAX_BATCH_SIZE = isProduction ? 25 : 2; // Max number of items to batch togeter in one kafka write
const MESSAGE_TOPICS = {
	TWITCH: 'twitch',
};

// API polling
const POLLING_INTERVAL = isProduction ? 60 * 60 * 1000 : 15000; // poll every hour or shorter in non-prod
const TWITCH_LIMIT_MS = 500 + 100; // 2 per second plus a buffer
const MAX_TOP_GAMES = 120;

module.exports = {
	MAX_BATCH_SIZE,
	MESSAGE_TOPICS,
	POLLING_INTERVAL,
	TWITCH_API_URL_V5,
	TWITCH_API_URL,
	TWITCH_DATA_TYPES,
	TWITCH_LIMIT_MS,
	MAX_TOP_GAMES,
};
