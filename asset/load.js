const loadPost = require("../request/post_body");
const sessions = require("../data/sessions");
const asset = require("./main");
const http = require("http");

/**
 * @param {http.IncomingMessage} req
 * @param {http.ServerResponse} res
 * @param {string} url
 * @returns {boolean}
 */
module.exports = function (req, res, url) {
	switch (req.method) {
		case "GET": {
			const match = req.url.match(/\/assets\/([^/]+)\/([^.]+)(?:\.xml)?$/);
			if (!match) return;

			const mId = match[1];
			const aId = match[2];
			const b = asset.loadLocal(mId, aId);
			if (b) {
				res.statusCode = 200;
				res.end(b);
			} else {
				res.statusCode = 404;
				res.end(e);
			}
			return true;
		}

		case "POST": {
			switch (url.path) {
				case "/goapi/getAsset/":
				case "/goapi/getAssetEx/": {
					loadPost(req, res).then((data) => {
						const mId = data.movieId || data.presaveId || sessions.get(req);
						const aId = data.assetId || data.enc_asset_id;

						const b = asset.loadLocal(mId, aId);
						sessions.set({ movieId: mId }, req);
						if (b) {
							res.setHeader("Content-Length", b.length);
							res.setHeader("Content-Type", "audio/mp3");
							res.end(b);
						} else {
							res.statusCode = 404;
							res.end();
						}
					});
					return true;
				}
				default:
					return;
			}
		}
		default:
			return;
	}
};
