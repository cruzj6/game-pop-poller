import * as R from 'ramda';

import { get } from '../../common/fetch';
import { TWITCH_API_URL, TWITCH_DATA_TYPES, TWITCH_API_URL_V5 } from '../../constants';
import { buildUrl, compact } from '../../common/utils';

// Setup utility function to get data from the twitch API
// Work with new twitch API
const getTwitchData = R.curry((type, params) => (
	get(buildUrl(TWITCH_API_URL, [params]), { 'Client-ID': process.env.TWITCH_CLIENT_ID })),
);

// Work with legacy V5 API
const getTwitchDataV5 = R.curry((type, params, summary) => (
	get(buildUrl(TWITCH_API_URL_V5, compact([type, summary ? 'summary' : ''])), params, { 'Client-ID': process.env.TWITCH_CLIENT_ID })
));

const getTwitchStreamData = getTwitchData(TWITCH_DATA_TYPES.STREAMS);
const getTwitchGameData = getTwitchData(TWITCH_DATA_TYPES.GAMES);

const getTwitchStreamDataSummary = getTwitchDataV5(TWITCH_DATA_TYPES.STREAMS, R.__, true);

const TwitchApiWrapper = {

	async getGameStreamData(gameId, paginationId) {
		return getTwitchStreamData({ game_id: gameId, first: 100, after: paginationId });
	},

	async getGameIdFromName(gameName) {
		// Get the ID for the game by name (take best match)
		const gameData = await getTwitchGameData({ name: gameName });

		const getId = R.path(['data', 'data', '0', 'id']);
		return getId(gameData);
	},

	async getGameStreamDataByName(gameName, paginationId) {
		const gameId = TwitchApiWrapper.getGameIdFromName(gameName);

		return TwitchApiWrapper.getGameStreamData(gameId, paginationId);
	},

	async getGameViewerNumbers(gameName) {
		return R.path(['data', 'viewers'], await getTwitchStreamDataSummary({ game: gameName }));
	},
};

export default TwitchApiWrapper;
