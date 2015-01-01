// Solo server


var Instagram = require('instagram-node-lib'),
	Twit = require('twit'),
	DataTransform = require("node-json-transform").DataTransform,
	DataMap = require("./map.json"),
	_ = require("underscore"),
	async = require("async");

Instagram.set('client_id', process.env.INSTAGRAM_CLIENT_ID);
Instagram.set('client_secret', process.env.INSTAGRAM_CLIENT_SECRET);
console.log("check",  process.env.INSTAGRAM_CLIENT_ID)
var Twitter = new Twit({
    consumer_key:         process.env.TWITTER_CONSUMER_KEY
  , consumer_secret:      process.env.TWITTER_CONSUMER_SECRET
  , access_token:         process.env.TWITTER_ACCESS_TOKEN
  , access_token_secret:  process.env.TWITTER_TOKEN_SECRET
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
