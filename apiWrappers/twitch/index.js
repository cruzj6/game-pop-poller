import url from 'url';
import * as r from 'ramda';

import { get } from '../../common/fetch';
import { TWITCH_API_URL, TWITCH_DATA_TYPES } from '../../constants';

// Setup utility function to get data from the twitch API
const getTwitchData = r.curry((type, params, summary) => (
	get(url.resolve(TWITCH_API_URL, type, summary ? 'summary' : ''), params, { 'Client-ID': process.env.TWITCH_CLIENT_ID })),
);

const getTwitchStreamData = getTwitchData(TWITCH_DATA_TYPES.STREAMS, '_', false);
const getTwitchGameData = getTwitchData(TWITCH_DATA_TYPES.GAMES, '_', false);

const getTwitchStreamDataSummary = getTwitchData(TWITCH_DATA_TYPES.STREAMS, '_', true);
const getTwitchGameDataSummary = getTwitchData(TWITCH_DATA_TYPES.GAMES, '_', true);

const TwitchApiWrapper = {

	async getGameStreamData(gameId, paginationId) {
		return getTwitchStreamData({ game_id: gameId, first: 100, after: paginationId });
	},

	async getGameStreamDataByName(gameName, paginationId) {
		// Get the ID for the game by name (take best match)
		const gameData = await getTwitchGameData({ name: gameName });

		const getId = r.path(['data', 'data', '0', 'id']);
		const gameId = getId(gameData);


		return TwitchApiWrapper.getGameStreamData(gameId, paginationId);
	},

	async getAllGameData(getGameData, gameIdentifier, curData = [], paginationId) {
		const getDataResults = r.path(['data', 'data']);

		const streamData = await getGameData(gameIdentifier, paginationId);
		const pagination = r.path(['data', 'pagination', 'cursor'], streamData);
		const data = [...curData, ...getDataResults(streamData)];

		console.log('Iterate', data.length / 100);
		if (pagination && data[data.length - 1].viewer_count !== 0) {
			return TwitchApiWrapper.getAllGameData(getGameData, gameIdentifier, data, pagination);
		}

		return data;
	},

	async getGameViewerNumbers({ gameName, gameId }) {
		const getStreamData = gameId ? TwitchApiWrapper.getGameStreamData : TwitchApiWrapper.getGameStreamDataByName;

		const streamData = await TwitchApiWrapper.getAllGameData(getStreamData, [gameId || gameName]);

		const countGameViews = r.reduce((count, curData) => {
			// console.log({ curData });
			console.log("COUNT", count); //eslint-disable-line

			return count + r.path(['viewer_count'], curData);
		}, 0);

		return countGameViews(streamData);
	},
};

export default TwitchApiWrapper;
