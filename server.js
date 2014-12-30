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

	function send(options) {
		var options = options || {
			contentType:"text/html",
			content:""
		};
  		res.writeHead(200, {'Content-Type': options.contentType});
  		res.writeHead(200, {'content-encoding': 'gzip'});
  		zlib.gzip(new Buffer(options.content), function(err, gzipped){
			res.end(gzipped, 'utf8');
		});		
	}

	// return the index file
  	if(queryData.pathname == '/') {

  		var index = index = fs.readFileSync('index.html');
  		send({content:index});

	// ajax search
  	} else if(queryData.pathname == '/search') {
  		console.log("searching for ");
  		console.log(JSON.stringify(queryData.query));
  		search(queryData.query, function(json){
			var content = JSON.stringify({items:json});
			send({content:content, contentType:'application/json'});
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

	  		send({content:file, contentType:mimetypes[extension]})
		}
  	}

}).listen(port);
console.log("Smells like updawg! on port " + port);
