// Solo server


var Instagram = require('instagram-node-lib'),
	Twit = require('twit'),
	http = require('http'),
	url = require('url'),
	fs = require('fs'),
	zlib = require('zlib'),
	port = process.env.PORT || 3000,
	search = require("./server/search").search,
	_ = require("underscore");

http.createServer(function (req, res) {

	var queryData = url.parse(req.url, true);
	//res.setEncoding('utf8');

	// return the index file
  	if(queryData.pathname == '/') {

  		var index = index = fs.readFileSync('index.html');
  		res.writeHead(200, {'Content-Type': 'text/html'});
  		res.writeHead(200, {'content-encoding': 'gzip'});
  		zlib.gzip(new Buffer(index), function(err, gzipped){
			res.end(gzipped, 'utf8');
		});

	// ajax search
  	} else if(queryData.pathname == '/search') {

  		res.writeHead(200, {'Content-Type': 'application/json'});
  		res.writeHead(200, {'content-encoding': 'gzip'});

  		search(queryData.query, function(json){
  			console.log("search", json);
			var buffer = new Buffer(JSON.stringify({items:json}));
			zlib.gzip(buffer, function(err, gzipped){
				res.end(gzipped, 'utf8');
			});
  		});

	// basic file server 
  	} else {

  		if(queryData.pathname != '/favicon.ico') {

	  		var file = fs.readFileSync(queryData.pathname.substr(1)),
	  		    mimetypes = {
		  			'css': 'text/css',
		  			'js': 'application/javascript',
		  			'html': 'text/html'
		  		},
	  			extension = queryData.pathname.split('.')[1];

	  		res.writeHead(200, {'Content-Type': mimetypes[extension] });
	  		res.writeHead(200, {'content-encoding': 'gzip'});
	  		zlib.gzip(new Buffer(file), function(err, gzipped){
				res.end(gzipped, 'utf8');
			});

		}
  	}

}).listen(port);
console.log("Smells like updawg!");
