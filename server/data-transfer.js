// Solo server


var Instagram = require('instagram-node-lib'),
	Twit = require('twit'),
	http = require('http'),
	url = require('url'),
	fs = require('fs'),
	zlib = require('zlib'),
	port = process.env.PORT || 3000,
	DataTransform = require("./server/data-transform").DataTransform,
	DataMap = require("./server/map.json");

	// Instagram
	// CLIENT ID	6cb56ab8349f4f719e7865d0f6429946
	// CLIENT SECRET	b0413f9089a749cc858d3187b026487a
	// WEBSITE URL	https://www.balancedscale.com
	// REDIRECT URI	http://www.balancedscale.com/instagram

	// Twitter 
	// Consumer key	faS1RUZsEwW9T7S4OM5BUw
	// Consumer secret	dcT0wa1BCuxyg66QOb7HpMePKrX2KuRQtjPjTbjH4

Instagram.set('client_id', '6cb56ab8349f4f719e7865d0f6429946');
Instagram.set('client_secret', 'b0413f9089a749cc858d3187b026487a');

var Twitter = new Twit({
    consumer_key:         'faS1RUZsEwW9T7S4OM5BUw'
  , consumer_secret:      'dcT0wa1BCuxyg66QOb7HpMePKrX2KuRQtjPjTbjH4'
  , access_token:         '15933181-crJlx7JOjunRcthjxXtfRJW05e5ex3YjRI6SZmLd2'
  , access_token_secret:  'hyvzzOpwBMmHnEy94qom5Sie3BHhEWXmcne3FQ8gT7sKB'
});

exports.DataTransfer = function(req, res, cb){

	return {

		search : function(obj, key) {

	  		res.writeHead(200, {'Content-Type': 'application/json'});
	  		res.writeHead(200, {'content-encoding': 'gzip'});

	  		var now = Math.round((new Date()).getTime() / 1000);
	  		var delta = 86400 * 2;
	  		var later = now - delta;
	  		var finished = 0;
	  		var json = {};

	  		function respond() {
	  			finished++;
	  			if(finished == 2) {
	  				var buffer = new Buffer(JSON.stringify(json));
	  				zlib.gzip(buffer, function(err, gzipped){
	  					res.end(gzipped, 'utf8');
	  				});
	  			}
	  		}

	  		// Instagram search
		  	Instagram.media.search({ 
		  		lat: queryData.query.lat, 
		  		lng: queryData.query.long, 
		  		max_timestamp: now,
		  		min_timestamp: later,
		  		complete:function(data, pagination){
		  			_.extend(json, DataTransform(data, DataMap.instagram).transform());
		  			respond();
	  			}
	  		});

			// Twitter search
			Twitter.get('search/tweets', {q: 'geocode:'+queryData.query.lat + ',' + queryData.query.long + ',1km'}, function(err, reply) {
				json.statuses = reply.statuses;
				_.extend(json, DataTransform(data, DataMap.twitter).transform());
	  			respond();
			});

		}

	};

};
