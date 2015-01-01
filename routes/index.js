var express = require('express');
var router = express.Router();
var search = require("../server/search").search;

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

/* do a search */
router.get('/search', function(req, res) {

  search(req.query, function(json){
	res.json({items:json});
  });

});

module.exports = router;
