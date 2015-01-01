var express = require('express');
var router = express.Router();
var search = require("../server/search").search;
var url = url = require('url');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

/* do a search */
router.get('/search', function(req, res) {

  var queryData = url.parse(req.url, true);
  console.log("query", req.query, queryData.query);
  search(queryData.query, function(json){
	res.json({items:json});
  });

});

module.exports = router;
