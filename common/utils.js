const R = require('ramda');
const url = require('url');

/**
* Create a promisified version of a function, while maintaining it's original owner
*/
const promisifyWithOwner = R.curry((owner, funcName, ...args) => {
	if (!owner) {
		throw new TypeError('Owner falsy for promisifyWithOwner');
	}

	return new Promise((resolve, reject) => (
		owner[funcName](...args, (err, data) => {
			if (err) reject(err);
			else resolve(data);
		})
	));
},
);

const buildUrl = R.reduce((curUrl, path) => url.resolve(`${curUrl}/`, path));
const compact = R.filter(Boolean);

module.exports = {
	promisifyWithOwner,
	buildUrl,
	compact,
};
