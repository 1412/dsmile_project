var router = require('express').Router();

router.get('/', function(req, res, next) {
	try {
		req.session.user = null;
		result = {
			success: true,
			data: {}
		};
	 	res.end(JSON.stringify(result));
	} catch(e) {
		next(e);
	}
});

router.post('/', function(req, res, next) {
	try {
		req.session.user = null;
	 	result = {
			success: true,
			data: {}
		};
	 	res.end(JSON.stringify(result));
	} catch(e) {
		next(e);
	}	
});

module.exports = router;