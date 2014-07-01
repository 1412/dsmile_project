var router = require('express').Router();

function signin(username, password, callback){
	result = {
		success: true,
		data: {}
	};
	db.User.find({ where: { username: username }, include: [{
		model: db.UserRole, include: [db.Privilege]
	}, db.Doctor] }).success(function(user) {		
		if (user == null) {
			result.success = false;
			result.data = "No such username!";
			callback(result);
  			return;
		}
		if (user.password != md5(password)) {
			result.success = false;
			result.data = "Wrong password";
			callback(result);
			return;
		}
		result.data = user.flatData;
  		callback(result);
  		return;
	}).error(function(e){
		result.success = false;
		result.data = e;
		callback(result);
		return;
	}); 
}

function md5(input){
	input = (input === undefined)? "":input;
	input = (input == null)? "":input;
	return require('crypto').createHash('md5').update(input.toString()).digest('hex');
}

router.get('/', function(req, res, next) {
	try {
	 	signin(req.query.username, req.query.password, function(d){
			if (d.success) {
				req.session.user = d.data; 
			} 
			res.end(JSON.stringify(d));
		});
	} catch(e) {
		next(e);
	}
});

router.post('/', function(req, res, next) {
	try {
	 	signin(req.body.username, req.body.password, function(d){
			if (d.success) {
				req.session.user = d.data; 
			} 
			res.end(JSON.stringify(d));	
		});
	} catch(e) {
		next(e);
	}	
});

module.exports = router;