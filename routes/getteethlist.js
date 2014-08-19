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
			result.data = [{
				id: 11,
				name: "Atas Kiri 1"
			}, {
				id: 12,
				name: "Atas Kiri 2"
			}, {
				id: 13,
				name: "Atas Kiri 3"
			}, {
				id: 14,
				name: "Atas Kiri 4"
			}, {
				id: 15,
				name: "Atas Kiri 5"
			}, {
				id: 16,
				name: "Atas Kiri 6"
			}, {
				id: 17,
				name: "Atas Kiri 7"
			}, {
				id: 18,
				name: "Atas Kiri 8"
			}, {
				id: 21,
				name: "Atas Kanan 1"
			}, {
				id: 22,
				name: "Atas Kanan 2"
			}, {
				id: 23,
				name: "Atas Kanan 3"
			}, {
				id: 24,
				name: "Atas Kanan 4"
			}, {
				id: 25,
				name: "Atas Kanan 5"
			}, {
				id: 26,
				name: "Atas Kanan 6"
			}, {
				id: 27,
				name: "Atas Kanan 7"
			}, {
				id: 28,
				name: "Atas Kanan 8"
			}, {
				id: 31,
				name: "Bawah Kiri 1"
			}, {
				id: 32,
				name: "Bawah Kiri 2"
			}, {
				id: 33,
				name: "Bawah Kiri 3"
			}, {
				id: 34,
				name: "Bawah Kiri 4"
			}, {
				id: 35,
				name: "Bawah Kiri 5"
			}, {
				id: 36,
				name: "Bawah Kiri 6"
			}, {
				id: 37,
				name: "Bawah Kiri 7"
			}, {
				id: 38,
				name: "Bawah Kiri 8"
			}, {
				id: 41,
				name: "Bawah Kanan 1"
			}, {
				id: 42,
				name: "Bawah Kanan 2"
			}, {
				id: 43,
				name: "Bawah Kanan 3"
			}, {
				id: 44,
				name: "Bawah Kanan 4"
			}, {
				id: 45,
				name: "Bawah Kanan 5"
			}, {
				id: 46,
				name: "Bawah Kanan 6"
			}, {
				id: 47,
				name: "Bawah Kanan 7"
			}, {
				id: 48,
				name: "Bawah Kanan 8"
			}];
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