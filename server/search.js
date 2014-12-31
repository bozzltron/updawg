// Solo server


var Instagram = require('instagram-node-lib'),
	Twit = require('twit'),
	DataTransform = require("node-json-transform").DataTransform,
	DataMap = require("./map.json"),
	_ = require("underscore"),
	async = require("async");

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
	var json = [];

	function respond() {
		finished++;
		if(finished == 2 && typeof(cb) == "function") {
			console.log("sort");
			var sorted = _.sortBy(json, function(item){
				return item.timestamp;
			});
			cb(sorted);
		}
	}

	// Search parallel
	async.parallel([
	    function(callback){

	    	// Twitter search
			Twitter.get('search/tweets', { 
				q: 'geocode:' + query.lat + ',' + query.long + ',1km' 
			}, function(err, data){
				callback(err, data);
			});
			//callback(null,{});
	    
	    },
	    function(callback){
		
			// Instagram search
		  	Instagram.media.search({ 
		  		lat: query.lat, 
		  		lng: query.long, 
		  		max_timestamp: now,
		  		min_timestamp: later,
		  		complete:function(data, pagination){
		  			//console.log("Instagram", arguments);
		  			callback(null, data);
		  		}
			});
	    //callback(null,{});

	    }
	],
	// optional callback
	function(err, results){

	    // the results array will equal ['one','two'] even though
	    // the second function had a shorter timeout.

	    // Process Twitter
	    var tagged = DataTransform(results[0], DataMap.twitter).transform();
		_.each(tagged, function(item){ 
			item.type = "twitter";  
			json.push(item);
		});

		// Process Instagram
		var tagged = DataTransform(results[1], DataMap.instagram).transform();
		_.each(tagged, function(item){ 
			item.type = "instagram";  
			json.push(item);
		});
		
		// Sort
		var sorted = _.sortBy(json, function(item){
			return item.timestamp;
		});

		// Return
		cb(sorted);
	});

};
