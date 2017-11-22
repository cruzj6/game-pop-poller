const logger = require('../common/logger');
const kafka = require('kafka-node');
const { promisifyWithin } = require('../common/utils');
const R = require('ramda');

// Setup kafka producer
const client = new kafka.Client();
const _producer = new kafka.Producer(client);

// Work with promises on the producer object's handlers
const producerEvent = promisifyWithin(_producer);
const producerOn = producerEvent('on');
const producerSend = producerEvent('send');

const _getPayload = R.curry((topic, message) => ({ topic, messages: message }));

const _getFormattedMessages = (messages) => {
	if (Array.isArray(messages)) return messages.map(_getFormattedMessages);
	if (typeof messages === 'object') return JSON.stringify(messages);
	return messages;
};

const init = async () => {
	try {
		const data = await producerOn('ready');
		logger.success(`Kafka producer ready: ${data}`);
	} catch (err) {
		logger.error(`problem setting up kafka producer: ${err}`);
	}
};

const sendMessages = async (topic, messages) => {
	const _messages = _getFormattedMessages(messages);
	const payloadForTopic = _getPayload(topic);
	const payload = Array.isArray(_messages)
		? _messages.map(payloadForTopic)
		: [payloadForTopic(_messages)];

	try {
		await producerSend(payload);
		logger.success('Wrote message to kafka');
	} catch (err) {
		logger.error(`problem sending payload to kafka: ${payload}`);
		throw err;
	}
};

module.exports = {
	init,
	sendMessages,
};
