// Solo server


var Instagram = require('instagram-node-lib'),
	http = require('http'),
	url = require('url'),
	fs = require('fs');

Instagram.set('client_id', '6cb56ab8349f4f719e7865d0f6429946');
Instagram.set('client_secret', 'b0413f9089a749cc858d3187b026487a');

http.createServer(function (req, res) {

	var queryData = url.parse(req.url, true);

  	if(queryData.pathname == '/') {

  		var index = index = fs.readFileSync('index.html');
  		res.writeHead(200, {'Content-Type': 'text/html'});
		res.end(index);

  	} else if(queryData.pathname == '/search') {

  		res.writeHead(200, {'Content-Type': 'application/json'});

	  	Instagram.media.search({ lat: 41.5908, lng: 93.6208, complete:function(data, pagination){
	  		res.end(JSON.stringify(data));
	  	}});

  	}

}).listen(3000);
console.log("Solo Up!");
