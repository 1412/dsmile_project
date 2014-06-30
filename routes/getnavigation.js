var router = require('express').Router();

router.get('/', function(req, res) {
	var result = {
        success: true,
        children: []
	}
	var user = req.session.user;
	if (user) {
		var privileges = user.privileges;
		if (privileges) {
			if (privileges.indexOf("ENTER_ADMIN_PAGE") > -1) {
				result.children.push({            
			        text: "Administrative",
			        id: "administrative",
			        expanded: true,
			        description: "Panels are the basic container that makes up the structure of most applications. Panels have a header and body, and can be arranged in various ways using layouts.",
			        children: [{
			            id: "basic-panels",
			            text: "Basic Panel",
			            leaf: true
			        }]
			    });
		    }
	        if (privileges.indexOf("ENTER_DOCTOR_PAGE") > -1) {
				result.children.push({
		            text: "Dokter",
		            id: "doctor",
		            expanded: true,
		            description: "Panels are the basic container that makes up the structure of most applications. Panels have a header and body, and can be arranged in various ways using layouts.",
		            children: [{
		                id: "framed-panels",
		                text: "Framed Panel",
		                leaf: true
		            }]
		        });
	        }
			if (privileges.indexOf("ENTER_RECEIPTIONIST_PAGE") > -1) {
				result.children.push({
		            text: "Resepsionis",
		            id: "receiptionist",
		            expanded: true,
		            description: "Panels are the basic container that makes up the structure of most applications. Panels have a header and body, and can be arranged in various ways using layouts.",
		            children: [{
		                id: "panel-header-position",
		                text: "Header Positioning",
		                leaf: true
		            }]
		        });
		    }
		    result.children.push({
	            text: "Settings",
	            id: "settings",
	            leaf: true
	        });
	        result.children.push({
	            text: "Logout",
	            id: "logout",
	            leaf: true
	        });
		}		
	}
  	res.end(JSON.stringify(result))
});

module.exports = router;