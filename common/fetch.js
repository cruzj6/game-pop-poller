const axios = require('axios');

export const get = (url, params) => axios.get(url, { params });
