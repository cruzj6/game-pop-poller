import axios from 'axios';

export const get = (url, params, headers) => axios.get(url, { params, headers });
