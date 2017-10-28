import url from 'url';
import * as r from 'ramda';

import { get } from '../../common/fetch';
import { TWITCH_API_URL, TWITCH_DATA_TYPES } from '../../constants';

// Setup utility function to get data from the twitch API
const getTwitchData = r.curry((type, params) => (
	get(url.resolve(TWITCH_API_URL, type), params, { 'Client-ID': process.env.TWITCH_CLIENT_ID })),
);

const getTwitchStreamData = getTwitchData(TWITCH_DATA_TYPES.STREAMS);
const getTwitchGameData = getTwitchData(TWITCH_DATA_TYPES.GAMES);

const TwitchApiWrapper = {

	async getGameStreamData(gameId) {
		return getTwitchStreamData({ game_id: gameId });
	},

	async getGameStreamDataByName(gameName) {
		// Get the ID for the game by name (take best match)
		const gameData = await getTwitchGameData({ name: gameName });

		const getId = r.path(['data', '0', 'id']);
		const gameId = getId(gameData);


		return this.getGameStreamData(gameId);
	},

	async getGameViewerNumbers({ gameName, gameId }) {
		const getStreamData = gameId ? this.getGameStreamData : this.getGameStreamDataByName;
		const streamData = await getStreamData(gameId || gameName);
		const countGameViews = r.reduce((count, curData) => count + r.path(['viewer_count'], curData), 0);

		return countGameViews(r.path(['data'], streamData));
	},
};

export default TwitchApiWrapper;
