var router = require('express').Router();

/* GET home page. */
router.get('/', function(req, res, next) {
	try {
		res.render('index', { 
			layout: 'layout',
			title: 'Some Title Lol' 
		});
	} catch (e) {
		next(e);
	}
});

module.exports = router;
