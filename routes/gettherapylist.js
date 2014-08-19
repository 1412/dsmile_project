var router = require('express').Router();

router.get('/', function(req, res, next) {
	try {
		var result = {
	        success: true,
	        data: []
		}
		var user = req.session.user;
		if (user.privileges.indexOf("ENTER_DOCTOR_PAGE")) {
			var page = req.query.page;
			var limit = req.query.limit;
			var start = req.query.start;
			var time = req.query.time;
			result.data.push({
				id: 1,
				name: "Perawatan 1",
				price: 2000,
				time: new Date()
			})
		  	res.end(JSON.stringify(result));
		} else {
			result.success = false;
			result.data = "No privileges";
			res.end(JSON.stringify(result));
		}		
	} catch (e) {
		next(e);
	}
});

module.exports = router;