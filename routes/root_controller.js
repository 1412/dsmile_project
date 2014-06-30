// load('application');

var DB = app.models;
var crypto = require('crypto');

action('index', function (c) {
	this.title = "Title Sample";
  	render();
});

/* Ajax Handler */
action('signin', function (c) {
    for (var i in req) {
        console.log(i)
        switch (i) {
            case "session":
            case "cookies":
                console.log(req[i])
            break;
        }
    }
    if (req.method.toLowerCase() == "get") {
        var username = req.query.username;
        var password = req.query.password;
    } else {
        var username = req.body.username;
        var password = req.body.password;
    }	
	
});

action('getnavigation', function (c) {
    console.log(req.cookies)
	result = {
        success: true,
        children: [{            
            text: "Administrative",
            id: "administrative",
            expanded: true,
            description: "Panels are the basic container that makes up the structure of most applications. Panels have a header and body, and can be arranged in various ways using layouts.",
            children: [{
                id: "basic-panels",
                text: "Basic Panel",
                leaf: true
            }]
        }, {
            text: "Dokter",
            id: "doctor",
            expanded: true,
            description: "Panels are the basic container that makes up the structure of most applications. Panels have a header and body, and can be arranged in various ways using layouts.",
            children: [{
                id: "framed-panels",
                text: "Framed Panel",
                leaf: true
            }]
        }, {
            text: "Resepsionis",
            id: "receiptionist",
            expanded: true,
            description: "Panels are the basic container that makes up the structure of most applications. Panels have a header and body, and can be arranged in various ways using layouts.",
            children: [{
                id: "panel-header-position",
                text: "Header Positioning",
                leaf: true
            }]
        }, {
            text: "Settings",
            id: "settings",
            leaf: true
        }, {
            text: "Logout",
            id: "logout",
            leaf: true
        }]
    };
	send(result);
});

function sendFailed(e) {
	result.success = false;
	result.reason = e;
	send(result);
}

function md5(input){
	input = (input === undefined)? "":input;
	input = (input == null)? "":input;
	return crypto.createHash('md5').update(input.toString()).digest('hex');
}