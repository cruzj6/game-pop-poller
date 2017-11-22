const axios = require('axios');

module.exports = {
	get: (url, params, headers) => axios.get(url, { params, headers }),
};
