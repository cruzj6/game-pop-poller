import 'babel-polyfill';
import 'dotenv';
import twitch from './apiWrappers/twitch';

const gameName = process.env.GAME_NAME || 'Diablo III';

const getGameCounts = name => (
	twitch.getGameViewerNumbers({ gameName: name })
		.then(console.log)
);

getGameCounts(gameName);
