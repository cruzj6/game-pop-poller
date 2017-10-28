const url = require('url');
const r = require('ramda');

const { get } = require('../../common/fetch');

const { TWITCH_API_URL, TWITCH_DATA_TYPES } = '../../constants';

// Setup utility function to get data from the twitch API
const getTwitchData = r.curry((type, params) => get(url.resolve(TWITCH_API_URL, type), params));
const getTwitchStreamData = getTwitchData(TWITCH_DATA_TYPES.STREAMS);
const getTwitchGameData = getTwitchData(TWITCH_DATA_TYPES.GAMES);

const twitchApi = {
	async getGameData(gameId) {
		return getTwitchStreamData({ game_id: gameId });
	},
	async getGameDataByName(gameName) {
		// Get the ID for the game by name (take best match)
		const getId = r.path(['data', '0', 'id']);
		const gameId = getId(await getTwitchGameData({ name: gameName }));

		return twitchApi.getGameData(gameId);
	},
};

module.exports = twitchApi;
