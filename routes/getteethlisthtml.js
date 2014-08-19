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
			res.render('teethselection', { 
			  	layout: '',
			  	title: 'D\'Smile Klinik'
			});
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