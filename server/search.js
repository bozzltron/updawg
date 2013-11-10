// Solo server


var Instagram = require('instagram-node-lib'),
	Twit = require('twit'),
	DataTransform = require("./data-transform").DataTransform,
	DataMap = require("./map.json"),
	_ = require("underscore");

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

exports.search = function(query, cb){

	var now = Math.round((new Date()).getTime() / 1000);
	var delta = 86400 * 2;
	var later = now - delta;
	var finished = 0;
	var json = {};

	function respond() {
		finished++;
		if(finished == 2 && typeof(cb) == "function") {
			cb(json);
		}
	}

	// Instagram search
  	Instagram.media.search({ 
  		lat: query.lat, 
  		lng: query.long, 
  		max_timestamp: now,
  		min_timestamp: later,
  		complete:function(data, pagination){
  			json = _.extend(json, DataTransform(data, DataMap.instagram).transform());
  			respond();
		}
	});

	// Twitter search
	Twitter.get('search/tweets', { q: 'geocode:' + query.lat + ',' + query.long + ',1km' }, function(err, reply) {
		json = _.extend(json, DataTransform(reply, DataMap.twitter).transform());
		respond();
	});

};
