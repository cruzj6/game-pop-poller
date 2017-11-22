const logger = require('../common/logger');
const messaging = require('./');
const { MESSAGE_TOPICS, MAX_BATCH_SIZE } = require('../constants');

// Send messages to kafka in batches
const currentBatch = [];

const postMessages = async (batch) => {
	logger.info('POSTING BATCH:', batch);
	return messaging.sendMessages(MESSAGE_TOPICS.TWITCH, batch);
};

const postAndClearBatch = () => {
	postMessages(currentBatch);
	currentBatch.splice(0, currentBatch.length);
};

const readyMessage = (message) => {
	currentBatch.push(message);

	// Post messages for the currentBatch async if it's hit the max size
	if (currentBatch.length >= MAX_BATCH_SIZE) {
		postAndClearBatch();
	}
};

const allMessagesDone = () => {
	// Empty the remaning messages
	if (currentBatch.length > 0) {
		postAndClearBatch();
	}
};

module.exports = {
	readyMessage,
	allMessagesDone,
};
