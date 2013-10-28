// Solo server


var Instagram = require('instagram-node-lib'),
	http = require('http'),
	url = require('url'),
	fs = require('fs');

Instagram.set('client_id', '6cb56ab8349f4f719e7865d0f6429946');
Instagram.set('client_secret', 'b0413f9089a749cc858d3187b026487a');

http.createServer(function (req, res) {

	var queryData = url.parse(req.url, true);

	// return the index file
  	if(queryData.pathname == '/') {

  		var index = index = fs.readFileSync('index.html');
  		res.writeHead(200, {'Content-Type': 'text/html'});
		res.end(index);

	// ajax search
  	} else if(queryData.pathname == '/search') {

  		console.log(queryData);
  		res.writeHead(200, {'Content-Type': 'application/json'});

  		var now = Math.round((new Date()).getTime() / 1000);
  		var delta = 86400 * 2;
  		var later = now - delta;

	  	Instagram.media.search({ 
	  		lat: queryData.query.lat, 
	  		lng: queryData.query.long, 
	  		max_timestamp: now,
	  		min_timestamp: later,
	  		complete:function(data, pagination){
	  		res.end(JSON.stringify(data));
	  	}});

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
			res.end(file);

		}
  	}

}).listen(3000);
console.log("Solo Up!");
