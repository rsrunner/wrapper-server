const env = Object.assign(process.env,
	require('./env.json'),
	require('./config.json'));

const http = require('http');
const pmc = require('./character/premade');
const aul = require('./asset_user/load');
const chl = require('./character/load');
const chs = require('./character/save');
const stl = require('./static/load');
const stp = require('./static/page');
const asl = require('./asset/load');
const ass = require('./asset/save');
const ast = require('./asset/thmb');
const mvl = require('./movie/load');
const mvL = require('./movie/list');
const mvm = require('./movie/meta');
const mvs = require('./movie/save');
const mvt = require('./movie/thmb');
const thL = require('./theme/list');
const thl = require('./theme/load');
const tsv = require('./tts/voices');
const tsl = require('./tts/load');
const url = require('url');

const functions = [
	mvL,
	pmc,
	asl,
	chl,
	thl,
	thL,
	chs,
	aul,
	tsl,
	ast,
	mvm,
	mvl,
	mvs,
	mvt,
	tsv,
	ass,
	stp,
	stl,
];

module.exports = http.createServer((req, res) => {
	const parsedUrl = url.parse(req.url, true);
	const found = functions.find(f => f(req, res, parsedUrl));
	if (!found) { res.statusCode = 404; res.end(); }
}).listen(env.PORT || env.SERVER_PORT, console.log);