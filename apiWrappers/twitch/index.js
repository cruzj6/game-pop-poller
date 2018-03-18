const R = require('ramda');
const { get } = require('../../common/fetch');
const { TWITCH_API_URL, TWITCH_DATA_TYPES, TWITCH_API_URL_V5 } = require('../../constants');
const { buildUrl, compact } = require('../../common/utils');

// Setup utility function to get data from the twitch API
// Work with new twitch API
const getTwitchData = R.curry((path, params) => (
	get(buildUrl(TWITCH_API_URL, path), params, { 'Client-ID': process.env.TWITCH_CLIENT_ID })),
);

// Work with legacy V5 API
const getTwitchDataV5 = R.curry((path, params, summary) => (
	get(buildUrl(TWITCH_API_URL_V5, compact([...path, summary ? 'summary' : ''])), params, { 'Client-ID': process.env.TWITCH_CLIENT_ID })
));

const getTwitchStreamData = getTwitchData([TWITCH_DATA_TYPES.STREAMS]);
const getTwitchStreamDataSummary = getTwitchDataV5([TWITCH_DATA_TYPES.STREAMS], R.__, true);

const getGameStreamData = async (gameId, paginationId) => (
	getTwitchStreamData({ game_id: gameId, first: 100, after: paginationId })
);

const getData = R.path(['data', 'data']);

const getTopGames = async (count = 20, { data = [], nextPage } = {}) => {
	console.log("GET TOP 1") // eslint-disable-line

	const getFromTopGames = getTwitchData([TWITCH_DATA_TYPES.GAMES, 'top']);
	console.log("GET TOP 2") // eslint-disable-line

	if (count > 100) {
		const nextData = await getFromTopGames({ first: 100, ...nextPage && { after: nextPage } });
		console.log("GET TOP 3") // eslint-disable-line

		return getTopGames(count - 100, {
			data: [...data, ...getData(nextData)],
			nextPage: R.path(['data', 'pagination', 'cursor'], nextData),
		});
	}

	return [...data, ...getData(await getFromTopGames({ first: count, ...nextPage && { after: nextPage } }))];
};

const getGameViewerNumbers = async gameName => (
	R.path(['data', 'viewers'], await getTwitchStreamDataSummary({ game: gameName }))
);

const TwitchApiWrapper = {
	getGameStreamData,
	getGameViewerNumbers,
	getTopGames,
};

module.exports = TwitchApiWrapper;
