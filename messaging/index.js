const kafka = require('kafka-node');
const R = require('ramda');

const logger = require('../common/logger');
const { promisifyWithOwner } = require('../common/utils');

const { KAFKA_HOST, KAFKA_PORT } = process.env;

// Setup kafka producer
let client;
let _producer;

const KAFKA_WAIT_TIME = process.env.NODE_ENV === 'production' ? 20000 : 0;
const KAFKA_CONNECT_TIMEOUT = 30000;
const _getPayload = R.curry((topic, message) => ({ topic, messages: message }));

const _getFormattedMessages = (messages) => {
	if (Array.isArray(messages)) return messages.map(_getFormattedMessages);
	if (typeof messages === 'object') return JSON.stringify(messages);
	return messages;
};

const init = async () => {
	try {
		logger.info('Waiting for kafka producer to be ready....');

		const data = await new Promise(async (resolve, reject) => {
			setTimeout(async () => {
				try {
					setTimeout(() => reject(new Error('Timeout waiting for kafka producer to be ready')), KAFKA_CONNECT_TIMEOUT);

					client = new kafka.KafkaClient({ kafkaHost: `${KAFKA_HOST}:${KAFKA_PORT}` });
					_producer = new kafka.Producer(client);

					const producerEvent = promisifyWithOwner(_producer);
					await producerEvent('on', 'ready');
					resolve();
				} catch (err) {
					reject(err);
				}
			}, KAFKA_WAIT_TIME);
		});

		logger.success(`Kafka producer ready: ${data}`);
	} catch (err) {
		logger.error(`problem setting up Kafka client or producer: ${err}`);
		throw err;
	}
};

const sendMessages = async (topic, messages) => {
	const producerEvent = promisifyWithOwner(_producer);
	const _messages = _getFormattedMessages(messages);
	const payloadForTopic = _getPayload(topic);
	const payload = Array.isArray(_messages)
		? _messages.map(payloadForTopic)
		: [payloadForTopic(_messages)];

	try {
		await producerEvent('send', payload);
		logger.success('Wrote message to kafka');
	} catch (err) {
		logger.error(`problem sending payload to Kafka: ${JSON.stringify(payload)}`);
		throw err;
	}
};

module.exports = {
	init,
	sendMessages,
};
