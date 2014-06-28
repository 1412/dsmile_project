var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { 
  	layout: 'layout',
  	title: 'Some Title Lol' 
  });
});

module.exports = router;
