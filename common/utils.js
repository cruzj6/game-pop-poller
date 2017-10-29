import * as R from 'ramda';
import url from 'url';

export const buildUrl = R.reduce((curUrl, path) => url.resolve(`${curUrl}/`, path));
export const compact = R.filter(Boolean);
