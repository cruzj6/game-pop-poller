const twitch = require('./index');
const { TWITCH_API_URL_V5, TWITCH_DATA_TYPES } = require('../../constants');
const fetch = require('../../common/fetch');

jest.mock('../../common/fetch');

test('does stuff', () => {
	fetch.get.mockImplementation(jest.fn().mockReturnValue({ data: { viewers: 50 } }));

	return twitch.getGameViewerNumbers('testGame')
		.then((count) => {
			expect(count).toBe(50);
			expect(fetch.get).lastCalledWith(`${TWITCH_API_URL_V5}/${TWITCH_DATA_TYPES.STREAMS}/summary`, { game: 'testGame' }, { 'Client-ID': process.env.TWITCH_CLIENT_ID });
		});
});
