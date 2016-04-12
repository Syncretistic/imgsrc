	var https = require('https');
	var express = require('express');
	var mongo = require('mongodb').MongoClient;
	var app = express();
	var GoogleSearch = require('google-search');
    var googleSearch = new GoogleSearch({
      key: 'AIzaSyCs218kODlgGD-NreAeAiLf6fsaK0Gn0dU',
      cx: '009901788001293305762%3A9lwuenivjuu'
    });
	var api = "https://www.googleapis.com/customsearch/v1?key=AIzaSyCs218kODlgGD-NreAeAiLf6fsaK0Gn0dU&cx=009901788001293305762%3A9lwuenivjuu";
	mongo.connect('mongodb://localhost:27017/clementinejs', function(err, db) {
		if (err) console.log('err0');
		app.get('/imgsrc/:keywords', function(req, res) {
			var offset = req.query.offset;
			var keywords = req.params.keywords;
			googleSearch.build({
                  q: keywords,
                  start: 0,
                  fileType: "image",
                  gl: "it", //geolocation, 
                  lr: "lang_it",
                  num: offset, // Number of search results to return between 1 and 10, inclusive 
                  siteSearch: "" // Restricts results to URLs from a specified site 
                }, function(error, response) {
                  console.log(response);
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
	var api = "https://www.googleapis.com/customsearch/v1?key=AIzaSyCs218kODlgGD-NreAeAiLf6fsaK0Gn0dU&cx=009901788001293305762%3A9lwuenivjuu&searchType=image"