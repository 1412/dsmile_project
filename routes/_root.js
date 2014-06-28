var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res) {
	res.render('_root', { 
	  	layout: '_root_layout',
	  	title: 'D\'Smile Klinik'
	});
});

module.exports = router;
