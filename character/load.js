const loadPost = require("../misc/post_body");
const character = require("./main");
const http = require("http");

/**
 * Fetch character XML
 *
 * @param      {http.IncomingMessage}  req     The request
 * @param      {http.ServerResponse}   res     The response
 * @return     {boolean}               { description_of_the_return_value }
 */
module.exports = function (req, res) {
	switch (req.method) {
		case "GET": {
			const match = req.url.match(/\/characters\/([^.]+)(?:\.xml)?$/);
			if (!match) return;

			var id = match[1];
			res.setHeader("Content-Type", "text/xml");
			character
				.load(id)
				.then((v) => {
					(res.statusCode = 200), res.end(v);
				})
				.catch((e) => {
					(res.statusCode = 404), res.end(e);
				});
			return true;
		}

		case "POST": {
			if (req.url != "/goapi/getCcCharCompositionXml/") return;
			loadPost(req, res).then(async ([data]) => {
				res.setHeader("Content-Type", "text/html; charset=UTF-8");
				character
					.load(data.assetId || data.original_asset_id)
					.then((v) => {
						(res.statusCode = 200), res.end(0 + v);
					})
					//.catch(e => { res.statusCode = 404, res.end(1 + e) })

					// Character not found?	Why not load my archnemesis instead?
					.catch(() =>
						character.load("a-306687427").then((v) => {
							(res.statusCode = 200), res.end(0 + v);
						})
					);
			});
			return true;
		}
		default:
			return;
	}
};
