import url from 'url';
import r from 'ramda';

import { get } from '../../common/fetch';
import { TWITCH_API_URL, TWITCH_DATA_TYPES } from '../../constants';

// Setup utility function to get data from the twitch API
const getTwitchData = r.curry((type, params) => get(url.resolve(TWITCH_API_URL, type), params));
const getTwitchStreamData = getTwitchData(TWITCH_DATA_TYPES.STREAMS);
const getTwitchGameData = getTwitchData(TWITCH_DATA_TYPES.GAMES);

const TwitchApiWrapper = {

	async getGameData(gameId) {
		return getTwitchStreamData({ game_id: gameId });
	},

	async getGameDataByName(gameName) {
		// Get the ID for the game by name (take best match)
		const getId = r.path(['data', '0', 'id']);
		const gameId = getId(await getTwitchGameData({ name: gameName }));

		return this.getGameData(gameId);
	},

	async getGameViewerNumbers({ gameName, gameId }) {
		try {
			const gameData = await gameId ? this.getGameData(gameId) : this.getGameDataByName(gameName);
		} catch (e) {
			console.error('Error getting game viewer numbers', e);
		}
	},
};

export default TwitchApiWrapper;
