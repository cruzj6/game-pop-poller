import 'babel-polyfill';
import dotenv from 'dotenv';

import twitch from './apiWrappers/twitch';
import logger from './common/logger';

dotenv.config();
const gameName = process.env.GAME_NAME || 'PLAYERUNKNOWN\'S BATTLEGROUNDS';

const getGameCounts = async name => (
	logger.info(await twitch.getGameViewerNumbers(name))
);

getGameCounts(gameName);
