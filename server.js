	var https = require('https');
	var express = require('express');
	var mongo = require('mongodb').MongoClient;
	var app = express();

	mongo.connect('mongodb://localhost:27017/clementinejs', function(err, db) {
		if (err) console.log(err);
		app.get('/imgsrc/:keywords', function(req, res) {
			var api = "https://www.googleapis.com/customsearch/v1?key=AIzaSyCs218kODlgGD-NreAeAiLf6fsaK0Gn0dU&cx=009901788001293305762%3A9lwuenivjuu&searchType=image";
			var offset = req.query.offset;
			var keywords = req.params.keywords;
			var time = Date();
			var recent = db.collection('recent');
			if (offset > 10 || offset < 1) {
				res.send('invalid offset(1-10)');
			}
			else {
				api = api + '&num=' + offset + '&q=' + keywords;
				console.log('query = ' + keywords + '\noffset = ' + offset + '\napi = ' + api + '\nTime = ' + time);
				var body = '';
				var results = [];
				recent.insert({
					query: keywords,
					when: time
				});
				https.get(api, function(response) {
					response.on('error', function(err) {
						console.log('AAAAAAAAAA' + err);
					}).on('data', function(chunk) {
						body += chunk;
					}).on('end', function() {
						body = JSON.parse(body);
						for (var i in body.items) {
							results.push({
								"URL": body.items[i].link,
								"snippet": body.items[i].snippet,
								"context": body.items[i].image.contextLink,
								"thumbnail": body.items[i].image.thumbnailLink
							});
						}
						res.send(results);
						console.log('send');
					});

				});
			}
		});

		app.get('/recent', function(req, res) {
			var clickProjection = {
				'_id': false
			};
			var cursor = db.collection('recent').find({}, {
				'_id': false
			}).sort({
				when: -1
			}).limit(5);
			var recentQueries = [];
			cursor.each(function(err, doc) {
				if (err) throw err;
				if (doc != null) {
					recentQueries.push(doc);
				}
				else {
					res.send(recentQueries);
				}
			});

		});

		app.get('/', function(req, res) {
			res.sendFile(process.cwd() + '/index.html');
		});
		app.listen(8080, function() {
			console.log('Listening on port 8080...');
		});
	});

	// google api key: AIzaSyCs218kODlgGD-NreAeAiLf6fsaK0Gn0dU